import { Directive, EventEmitter, Injector, Input, OnDestroy, Output, ComponentRef, NgZone, ViewContainerRef, Component, createComponent, EnvironmentInjector } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { PblNgridComponent, PblNgridPluginController, PblNgridRowComponent } from '@perbula/ngrid';

import { PblDetailsRowToggleEvent, PLUGIN_KEY } from './tokens';
import { PblNgridDetailRowComponent } from './row';
import { PblNgridDetailRowParentRefDirective } from './directives';
import { DetailRowController } from './detail-row-controller';

declare module '@perbula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    detailRow?: PblNgridDetailRowPluginDirective<any>;
  }
}

export const ROW_WHEN_TRUE = () => true;
export const ROW_WHEN_FALSE = () => false;

export function toggleDetailRow<T = any>(grid: PblNgridComponent<T>, row: T, forceState?: boolean): boolean | void {
  const controller = PblNgridPluginController.find(grid);
  if (controller) {
    const plugin = controller.getPlugin(PLUGIN_KEY);
    if (plugin) {
      return plugin.toggleDetailRow(row, forceState);
    }
  }
}

@Directive({ selector: 'pbl-ngrid[detailRow]', exportAs: 'pblNgridDetailRow', standalone: false, })
export class PblNgridDetailRowPluginDirective<T> implements OnDestroy {
  /**
   * Detail row control (none / all rows / selective rows)
   *
   * A detail row is an additional row added below a row rendered with the context of the row above it.
   *
   * You can enable/disable detail row for the entire grid by setting `detailRow` to true/false respectively.
   * To control detail row per row, provide a predicate.
   */
  @Input() get detailRow(): ( (index: number, rowData: T) => boolean ) | boolean { return this._detailRow; }
  set detailRow(value: ( (index: number, rowData: T) => boolean ) | boolean ) {
    if (this._detailRow !== value) {
      const grid = this.grid;

      if (typeof value === 'function') {
        this._isSimpleRow = (index: number, rowData: T) => !(value as any)(index, rowData);
        this._isDetailRow = value;
      } else {
        value = coerceBooleanProperty(value);
        this._isDetailRow = value ? ROW_WHEN_TRUE : ROW_WHEN_FALSE;
        this._isSimpleRow = value ? ROW_WHEN_FALSE : ROW_WHEN_TRUE;
      }
      this._detailRow = value;

      if (grid.isInit) {
        this.updateTable();
      }
    }
  }

  @Input() set singleDetailRow(value: boolean) {
    value = coerceBooleanProperty(value);
    if (this._forceSingle !== value) {
      this._forceSingle = value;
      if (value && this._openedRow && this._openedRow.expended) {
        for (const detailRow of this._detailRowRows) {
          if (detailRow.context.$implicit !== this._openedRow.row) {
            detailRow.toggle(false);
          }
        }
      }
    }
  }

  /**
   * A list of columns that will not trigger a detail row toggle when clicked.
   */
  @Input() excludeToggleFrom: string[];

  /**
   * Set the behavior when the row's context is changed while the detail row is opened  (another row is displayed in place of the current row) or closed.
   *
   * - context: use the context to determine if to open or close the detail row
   * - ignore: don't do anything, leave as is (for manual intervention)
   * - close: close the detail row
   * - render: re-render the row with the new context
   *
   * The default behavior is `context`
   *
   * This scenario will pop-up when using pagination and the user move between pages or change the page size.
   * It might also happen when the data is updated due to custom refresh calls on the datasource or any other scenario that might invoke a datasource update.
   *
   * The `ignore` phase, when used, will not trigger an update, leaving the detail row opened and showing data from the previous row.
   * The `ignore` is intended for use with `toggledRowContextChange`, which will emit when the row context has changed, this will allow the developer to
   * toggle the row (mimic `close`) or update the context manually. For example, if toggling open the detail row invokes a "fetch" operation that retrieves data for the detail row
   * this will allow updates on context change.
   *
   * Usually, what you will want is "context" (the default) which will remember the last state of the row and open it based on it.
   *
   * > Note that for "context" to work you need to use a datasource in client side mode and it must have a primary/identity column (pIndex) or it will not be able to identify the rows.
   *
   * > Note that `toggledRowContextChange` fires regardless of the value set in `whenContextChange`
   */
  @Input() whenContextChange: 'ignore' | 'close' | 'render' | 'context' = 'context';

  /**
   * Emits whenever a detail row instance is toggled on/off
   * Emits an event handler with the row, the toggle state and a toggle operation method.
   */
  @Output() toggleChange = new EventEmitter<PblDetailsRowToggleEvent<T>>();
  /**
   * Emits whenever the row context has changed while the row is toggled open.
   * This scenario is unique and will occur only when a detail row is opened AND the parent row has changed.
   *
   * For example, when using pagination and the user navigates to the next/previous set or when the rows per page size is changed.
   * It might also occur when the data is updated due to custom refresh calls on the datasource or any other scenario that might invoke a datasource update.
   *
   * Emits an event handler with the row, the toggle state and a toggle operation method.
   */
  @Output() toggledRowContextChange = new EventEmitter<PblDetailsRowToggleEvent<T>>();

  public readonly detailRowCtrl: DetailRowController;

  private _openedRow?: PblDetailsRowToggleEvent<T>;
  private _forceSingle: boolean;
  private _isSimpleRow: (index: number, rowData: T) => boolean = ROW_WHEN_TRUE;
  private _isDetailRow: (index: number, rowData: T) => boolean = ROW_WHEN_FALSE;
  private _detailRowRows = new Set<PblNgridDetailRowComponent>();
  private _detailRow: ( (index: number, rowData: T) => boolean ) | boolean;
  private _detailRowDef: PblNgridDetailRowParentRefDirective<T>;
  private _defaultParentRef: ComponentRef<PblNgridDefaultDetailRowParentComponent>;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;
  private _cdPending: boolean;
  private readonly grid: PblNgridComponent<any>;

  constructor(vcRef: ViewContainerRef,
              private readonly pluginCtrl: PblNgridPluginController<T>,
              private readonly ngZone: NgZone,
              private readonly injector: Injector) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);
    this.grid = pluginCtrl.extApi.grid;
    this.detailRowCtrl = new DetailRowController(vcRef, pluginCtrl.extApi);

    pluginCtrl.onInit()
      .subscribe(() => {
        pluginCtrl.ensurePlugin('targetEvents'); // Depends on target-events plugin

        this.grid.registry.changes
          .subscribe( changes => {
            for (const c of changes) {
              switch (c.type) {
                case 'detailRowParent':
                  if (c.op === 'remove') {
                    this.pluginCtrl.extApi.cdkTable.removeRowDef(c.value);
                    this._detailRowDef = undefined;
                  }
                  this.setupDetailRowParent();
                  break;
              }
            }
          });

        // if we start with an initial value, then update the grid cause we didn't do that
        // when it was set (we cant cause we're not init)
        // otherwise just setup the parent.
        if (this._detailRow) {
          this.updateTable();
        } else {
          this.setupDetailRowParent();
        }
      });
  }

  addDetailRow(detailRow: PblNgridDetailRowComponent): void {
    this._detailRowRows.add(detailRow);
  }

  removeDetailRow(detailRow: PblNgridDetailRowComponent): void {
    this._detailRowRows.delete(detailRow);
  }

  toggleDetailRow(row: any, forceState?: boolean): boolean | void {
    for (const detailRow of this._detailRowRows) {
      if (detailRow.context.$implicit === row) {
        detailRow.toggle(forceState);
        return detailRow.expended;
      }
    }
  }

  markForCheck() {
    if (!this._cdPending) {
      this._cdPending = true;
      this.ngZone.runOutsideAngular(() => Promise.resolve()
        .then(() => {
          this.ngZone.run(() => {
            this._cdPending = false;
            this._defaultParentRef?.changeDetectorRef.markForCheck();
          });
        }));
    }
  }

  ngOnDestroy(): void {
    if (this._defaultParentRef) {
      this._defaultParentRef.destroy();
    }
    this._removePlugin(this.grid);
  }

  /** @internal */
  detailRowToggled(event: PblDetailsRowToggleEvent<T>): void {
    // logic for closing previous row
    const isSelf = this._openedRow && this._openedRow.row === event.row;
    if (event.expended) {
      if (this._forceSingle && this._openedRow && this._openedRow.expended && !isSelf) {
        this._openedRow.toggle();
      }
      this._openedRow = event;
    } else if (isSelf) {
      this._openedRow = undefined;
    }
    this.toggleChange.emit(event);
  }

  private setupDetailRowParent(): void {
    const grid = this.grid;
    const cdkTable = this.pluginCtrl.extApi.cdkTable;
    if (this._detailRowDef) {
      cdkTable.removeRowDef(this._detailRowDef);
      this._detailRowDef = undefined;
    }
    if (this.detailRow) {
      let detailRow = this.pluginCtrl.extApi.registry.getSingle('detailRowParent');
      if (detailRow) {
        this._detailRowDef = detailRow = detailRow.clone();
        Object.defineProperty(detailRow, 'when', { enumerable: true,  get: () => this._isDetailRow });
      } else if (!this._defaultParentRef) {
        // We don't have a template in the registry, so we register the default component which will push a new template to the registry
        // TODO: move to module? set in root registry? put elsewhere to avoid grid sync (see event of registry change)...
        this._defaultParentRef = createComponent(PblNgridDefaultDetailRowParentComponent, {
          environmentInjector: this.injector.get(EnvironmentInjector),
          elementInjector: this.injector
        });
        this._defaultParentRef.changeDetectorRef.detectChanges(); // kick it for immediate emission of the registry value
        return;
      }
    }
    this.resetTableRowDefs();
  }

  private resetTableRowDefs(): void {
    if (this._detailRowDef) {
      this._detailRow === false
        ? this.pluginCtrl.extApi.cdkTable.removeRowDef(this._detailRowDef)
        : this.pluginCtrl.extApi.cdkTable.addRowDef(this._detailRowDef)
      ;
    }
  }

  /**
   * Update the grid with detail row info.
   * Instead of calling for a change detection cycle we can assign the new predicates directly to the pblNgridRowDef instances.
   */
  private updateTable(): void {
    this.grid._tableRowDef.when = this._isSimpleRow;
    this.setupDetailRowParent();
    // Once we changed the `when` predicate on the `CdkRowDef` we must:
    //   1. Update the row cache (property `rowDefs`) to reflect the new change
    this.pluginCtrl.extApi.cdkTable.updateRowDefCache();

    //   2. re-render all rows.
    // The logic for re-rendering all rows is handled in `CdkTable._forceRenderDataRows()` which is a private method.
    // This is a workaround, assigning to `multiTemplateDataRows` will invoke the setter which
    // also calls `CdkTable._forceRenderDataRows()`
    // TODO: This is risky, the setter logic might change.
    // for example, if material will chack for change in `multiTemplateDataRows` setter from previous value...
    this.pluginCtrl.extApi.cdkTable.multiTemplateDataRows = !!this._detailRow;
  }

  static ngAcceptInputType_detailRow: BooleanInput | ( (index: number, rowData: any) => boolean );
}

/**
 * Use to set the a default `pblNgridDetailRowParentRef` if the user did not set one.
 * @internal
 */
 @Component({
  selector: 'pbl-ngrid-default-detail-row-parent',
  template: `<pbl-ngrid-row *pblNgridDetailRowParentRef="let row;" detailRow></pbl-ngrid-row>`,
  standalone: false,
})
export class PblNgridDefaultDetailRowParentComponent { }
