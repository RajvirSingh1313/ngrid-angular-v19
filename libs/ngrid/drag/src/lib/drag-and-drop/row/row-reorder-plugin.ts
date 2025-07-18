import { Directive, Input, OnDestroy } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  DragDrop,
  CdkDropListGroup,
  CDK_DROP_LIST,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';

import { PblNgridComponent } from '@perbula/ngrid';
import { PblDragDrop, CdkLazyDropList } from '../core/index';
import { PblNgridRowDragDirective } from './row-drag';
import { patchDropListRef } from './row-drop-list-ref';

declare module '@perbula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    rowReorder?: PblNgridRowReorderPluginDirective;
  }
}

export const ROW_REORDER_PLUGIN_KEY: 'rowReorder' = 'rowReorder';

let _uniqueIdCounter = 0;

@Directive({
  selector: 'pbl-ngrid[rowReorder]', // tslint:disable-line: directive-selector
  exportAs: 'pblNgridRowReorder',
  host: {
    // tslint:disable-line:no-host-metadata-property
    class: 'cdk-drop-list',
    '[id]': 'id',
    '[class.cdk-drop-list-dragging]': '_dropListRef.isDragging()',
    '[class.cdk-drop-list-receiving]': '_dropListRef.isReceiving()',
    '[class.pbl-row-reorder]':
      'rowReorder && !this.grid.ds?.sort.sort?.order && !this.grid.ds?.filter?.filter',
  },
  standalone: false,
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CdkDropListGroup, useValue: undefined },
    { provide: CDK_DROP_LIST, useExisting: PblNgridRowReorderPluginDirective },
  ],
})
export class PblNgridRowReorderPluginDirective<T = any>
  extends CdkLazyDropList<T, PblNgridRowReorderPluginDirective<T>>
  implements OnDestroy
{
  id = `pbl-ngrid-row-reorder-list-${_uniqueIdCounter++}`;

  @Input() get rowReorder(): boolean {
    return this._rowReorder;
  }
  set rowReorder(value: boolean) {
    value = coerceBooleanProperty(value);
    this._rowReorder = value;
  }

  private _rowReorder = false;
  private _removePlugin: (grid: PblNgridComponent<any>) => void;

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._removePlugin(this.grid);
  }

  getSortedItems() {
    const { rowsApi } = this.gridApi;
    // The CdkTable has a view repeater that cache view's for performance (only when virtual scroll enabled)
    // A cached view is not showing but still "living" so it's CdkDrag element is still up in the air
    // We need to filter them out
    // An alternative will be to catch the events of the rows attached/detached and add/remove them from the drop list.
    return (super.getSortedItems() as PblNgridRowDragDirective[]).filter(
      (item) => {
        return rowsApi.findRowByElement(item.getRootElement())?.attached;
      },
    );
  }

  protected initDropListRef(): void {
    patchDropListRef(this.pblDropListRef as any, this.gridApi);
  }

  protected gridChanged() {
    this._removePlugin = this.gridApi.pluginCtrl.setPlugin(
      ROW_REORDER_PLUGIN_KEY,
      this,
    );

    // Use the table body container instead of scroll container for better DOM structure compatibility
    this.directContainerElement = '.pbl-ngrid-scroll-container .cdk-table';

    // Fallback to scroll container if table not found
    if (
      !this.originalElement.nativeElement.querySelector(
        this.directContainerElement,
      )
    ) {
      this.directContainerElement = '.pbl-ngrid-scroll-container';
    }

    // Final fallback to no direct container (use the pbl-ngrid element itself)
    if (
      !this.originalElement.nativeElement.querySelector(
        this.directContainerElement,
      )
    ) {
      console.warn(
        'PblNgridRowReorderPlugin: Could not find scroll container, using grid element directly',
      );
      this.directContainerElement = '';
    }

    this.dropped.subscribe((event: CdkDragDrop<T>) => {
      const item = event.item as PblNgridRowDragDirective<T>;

      if (!item.draggedContext || !item.draggedContext.row) {
        console.error(
          'PblNgridRowReorderPlugin: draggedContext is undefined or missing row data',
          {
            item,
            draggedContext: item.draggedContext,
            event,
          },
        );
        return;
      }

      const previousIndex = this.grid.ds.source.indexOf(
        item.draggedContext.row,
      );
      const currentIndex = event.currentIndex + this.grid.ds.renderStart;

      if (previousIndex === -1) {
        console.error(
          'PblNgridRowReorderPlugin: Could not find row in data source',
          {
            row: item.draggedContext.row,
            dataSource: this.grid.ds.source,
          },
        );
        return;
      }

      this.grid.ds.moveItem(previousIndex, currentIndex, true);
      this.grid.rowsApi.syncRows('data');
    });
  }

  static ngAcceptInputType_rowReorder: BooleanInput;
}
