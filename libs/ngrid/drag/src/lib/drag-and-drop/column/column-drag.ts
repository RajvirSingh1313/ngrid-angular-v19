import { Directive, Input } from '@angular/core';
import { DragDrop, CDK_DRAG_PARENT } from '@angular/cdk/drag-drop';

import { unrx } from '@perbula/ngrid/core';
import { PblColumn, PblNgridPluginController } from '@perbula/ngrid';
import { PblDragDrop, CdkLazyDrag } from '../core/index';
import { COL_DRAG_CONTAINER_PLUGIN_KEY, PblNgridColumnDragContainerDirective } from './column-drag-container';

@Directive({
  selector: '[pblNgridColumnDrag]',
  exportAs: 'pblNgridColumnDrag',
  host: { // tslint:disable-line:no-host-metadata-property
    'class': 'cdk-drag',
    '[class.cdk-drag-dragging]': '_dragRef.isDragging()',
  },
  standalone: false,
  providers: [
    { provide: DragDrop, useExisting: PblDragDrop },
    { provide: CDK_DRAG_PARENT, useExisting: PblNgridColumnDragDirective }
  ]
})
export class PblNgridColumnDragDirective<T = any> extends CdkLazyDrag<T, PblNgridColumnDragContainerDirective<T>, PblNgridColumnDragDirective<T>> {
  rootElementSelector = 'pbl-ngrid-header-cell';

  @Input('pblNgridColumnDrag') get column(): PblColumn { return this._column; }
  set column(value: PblColumn) {
    if (value !== this._column) {
      this._column = value;
      this.updateDisabledState();
    }
  }

  private _column: PblColumn;
  private cache: HTMLElement[];

  ngAfterViewInit(): void {
    if (!this.cdkDropList) {
      this.cdkDropList = PblNgridPluginController.findPlugin(this.column.columnDef.grid, COL_DRAG_CONTAINER_PLUGIN_KEY);
    }

    super.ngAfterViewInit();

    this._dragRef.beforeStarted.subscribe( () => {
      const { cdkDropList } = this;
      if (cdkDropList?.canDrag(this.column)) {
        // we don't allow a new dragging session before the previous ends.
        // this sound impossible, but due to animation transitions its actually is.
        // if the `transitionend` is long enough, a new drag can start...
        //
        // the `disabled` state is checked by pointerDown AFTER calling before start so we can cancel the start...
        if (cdkDropList._dropListRef.isDragging()) {
          return this.disabled = true;
        }
      }
    });

    this.started.subscribe( () => {
      if (this._column.columnDef) {
        this.column.columnDef.isDragging = true;
      }
    });
    this.ended.subscribe( () => {
      if (this._column.columnDef) {
        this.column.columnDef.isDragging = false;
      }
    });
  }

  ngOnDestroy(): void {
    unrx.kill(this);
    super.ngOnDestroy();
  }

  getCells(): HTMLElement[] {
    if (!this.cache) {
      this.cache = this.column.columnDef.queryCellElements('table');
    }
    return this.cache;
  }

  reset(): void {
    super.reset();
    if (this.cache) {
      for (const el of this.cache) {
        el.style.transform = ``;
      }
      this.cache = undefined;
    }
  }

  protected dropContainerChanged(prev: PblNgridColumnDragContainerDirective<T>) {
    if (prev) {
      unrx.kill(this, prev);
    }

    this.updateDisabledState();

    this.updateBoundaryElement();
    if (this.cdkDropList) {
      this.cdkDropList.connectionsChanged
        .pipe(unrx(this, this.cdkDropList))
        .subscribe(() => this.updateBoundaryElement());
    }
  }

  private updateDisabledState() {
    this.disabled = this.column && this.cdkDropList ? !this.cdkDropList.canDrag(this.column) : true;
  }

  private updateBoundaryElement() {
    if (this.cdkDropList?.hasConnections()) {
      this.boundaryElement = undefined;
    } else {
      this.boundaryElement = this.cdkDropList.directContainerElement;
    }
  }
}
