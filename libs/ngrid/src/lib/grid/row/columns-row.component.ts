import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation, Optional, ComponentRef, Attribute, ChangeDetectorRef, OnDestroy, OnInit, Inject, Injector, runInInjectionContext } from '@angular/core';
import { CdkHeaderRow } from '@angular/cdk/table';
import { PblMetaRowDefinitions, unrx } from '@perbula/ngrid/core';

import { _PblNgridComponent, PBL_NGRID_COMPONENT } from '../../tokens';
import { PblNgridBaseRowComponent, PBL_NGRID_BASE_ROW_TEMPLATE } from './base-row.component';
import { PblColumn } from '../column/model';
import { PblNgridMetaRowService, PblMetaRow } from '../meta-rows/meta-row.service';
import { PblNgridHeaderCellComponent } from '../cell/header-cell.component';
import { applyMetaRowClass, initColumnOrMetaRow, setRowVisibility } from './utils';
import { PblNgridColumnDef } from '../column/directives/column-def';
import { EXT_API_TOKEN, PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

/**
 * The row that represents the columns of the grid.
 * There are only 2 column rows in a grid, the top (header) and bottom (footer), both optional.
 */
@Component({
  selector: 'pbl-ngrid-column-row',
  template: PBL_NGRID_BASE_ROW_TEMPLATE,
  host: { // tslint:disable-line:no-host-metadata-property
    'role': 'row',
  },
  providers: [
    { provide: CdkHeaderRow, useExisting: PblNgridColumnRowComponent }
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class PblNgridColumnRowComponent extends PblNgridBaseRowComponent<'header' | 'footer', PblMetaRowDefinitions> implements PblMetaRow, OnInit, OnDestroy {

  @Input() set row(value: PblMetaRowDefinitions) { this.updateRow(value); }

  get rowIndex(): number { return 0; }

  get meta(): PblMetaRowDefinitions { return this._meta; }
  set meta(value: PblMetaRowDefinitions) { this._meta = value; } // TODO: remove when removing pblMetaRow

  readonly rowType: 'header' | 'footer';
  readonly element: HTMLElement = undefined!;
  readonly isFooter: boolean;
  readonly gridWidthRow: boolean;
  private _meta: PblMetaRowDefinitions;

  constructor(@Inject(PBL_NGRID_COMPONENT) @Optional() grid: _PblNgridComponent,
              @Inject(EXT_API_TOKEN) public extApi: PblNgridInternalExtensionApi,
              public injector: Injector,
              cdRef: ChangeDetectorRef,
              el: ElementRef<HTMLElement>,
              private readonly metaRows: PblNgridMetaRowService,
              @Attribute('footer') isFooter: any,
              @Attribute('gridWidthRow') gridWidthRow: any) {
    super(grid, cdRef, extApi, injector, el);
    this.gridWidthRow = gridWidthRow !== null;
    this.isFooter = isFooter !== null;
    this.rowType = this.isFooter ? 'footer' : 'header';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.handleVisibility();
  }

  ngOnDestroy(): void {
    this.metaRows.removeMetaRow(this);
    super.ngOnDestroy();
  }

  updateSize() {
    if (this.gridWidthRow) {
      for (const c of this._cells as ComponentRef<PblNgridHeaderCellComponent>[]) {
        c.instance.updateSize();
      }
    }
  }

  protected onCtor() { }

  protected detectChanges() {
    for (const cell of this._cells) {
      // TODO: the cells are created through code which mean's that they don't belong
      // to the CD tree and we need to manually mark them for checking
      // We can customize the diffing, detect context changes internally and only trigger these cells which have changed!
      cell.changeDetectorRef.markForCheck();
    }
  }

  protected updateRow(value: PblMetaRowDefinitions) {
    if (value !== this._meta) {
      applyMetaRowClass(this.metaRows, this, this.elementRef.nativeElement, this._meta, value);
    }
  }

  protected cellCreated(column: PblColumn, cell: ComponentRef<PblNgridHeaderCellComponent>) {
    if (!column.columnDef) {
      const pblNgridColumnDef = runInInjectionContext(this.injector, () => new PblNgridColumnDef(this.extApi));
      pblNgridColumnDef.column = column;
      column.columnDef.name = column.id;
    }
    cell.instance.setColumn(column, this.gridWidthRow);
  }

  protected cellDestroyed(cell: ComponentRef<PblNgridHeaderCellComponent>, previousIndex: number) {
    unrx.kill(this, cell.instance.column);
  }

  private handleVisibility() {
    initColumnOrMetaRow(this.elementRef.nativeElement, this.isFooter);
    const key = this.isFooter ? 'showFooter' : 'showHeader';
    if (!this._extApi.grid[key]) {
      setRowVisibility(this.elementRef.nativeElement, false);
    }

    this._extApi.propChanged
      .pipe(unrx(this))
      .subscribe( event => {
        if (event.source === this._extApi.grid && event.key === key) {
          setRowVisibility(this.elementRef.nativeElement, event.prev === false)
        }
      });
  }
}
