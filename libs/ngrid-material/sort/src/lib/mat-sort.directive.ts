import { Directive, OnDestroy } from '@angular/core';
import { Sort, MatSort, MatSortHeader, SortDirection } from '@angular/material/sort';

import { ON_INVALIDATE_HEADERS, unrx } from '@perbula/ngrid/core';
import { PblNgridComponent, PblNgridPluginController, PblNgridSortDefinition, PblDataSource } from '@perbula/ngrid';

declare module '@perbula/ngrid/lib/ext/types' {
  interface PblNgridPluginExtension {
    matSort?: PblNgridMatSortDirective;
  }
}
export const PLUGIN_KEY: 'matSort' = 'matSort';

@Directive({ selector: 'pbl-ngrid[matSort]', exportAs: 'pblMatSort', standalone: false, })
export class PblNgridMatSortDirective implements OnDestroy {
  private _removePlugin: (table: PblNgridComponent<any>) => void;

  constructor(public table: PblNgridComponent<any>, private pluginCtrl: PblNgridPluginController, public sort: MatSort) {
    this._removePlugin = pluginCtrl.setPlugin(PLUGIN_KEY, this);

    let origin: 'ds' | 'click' = 'click';
    this.sort.sortChange
      .pipe(unrx(this))
      .subscribe( s => {
        this.onSort(s, origin);
        origin = 'click';
      });

    const handleDataSourceSortChange = (sortChange: PblDataSource['sort']) => {
      const { column } = sortChange;
      const order = sortChange.sort ? sortChange.sort.order : undefined;

      if (this.sort && column) {
        if (this.sort.active === column.id && this.sort.direction === (order || '')) { return; }
        const sortable: MatSortHeader = this.sort.sortables.get(column.id) as any;
        if (sortable) {
          origin = 'ds';
          this.sort.active = undefined;
          sortable.start = order || 'asc';
          // sortable._handleClick();
          this.sort.sort(sortable);
        }
      } else if (this.sort.active) { // clear mode (hit from code, not click).
        const sortable: MatSortHeader = this.sort.sortables.get(this.sort.active) as any;
        if (sortable ) {
          if (!sortable.disableClear) {
            let nextSortDir: SortDirection;
            while (nextSortDir = this.sort.getNextSortDirection(sortable)) {
              this.sort.direction = nextSortDir;
            }
          }
          origin = 'ds';
          // sortable._handleClick();
          this.sort.sort(sortable);
        }
      }
    }

    pluginCtrl.events
      .pipe(ON_INVALIDATE_HEADERS)
      .subscribe( e => {
        const hasActiveSort = this.sort && this.sort.active;
        if (table.ds && table.ds.sort) {
          if (!table.ds.sort.column && hasActiveSort) {
            this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' }, origin);
          } else if (table.ds.sort.column && !hasActiveSort) {
            setTimeout(() => handleDataSourceSortChange(table.ds.sort));
          }
        }
      });

    pluginCtrl.events
      .subscribe( e => {
        if (e.kind === 'onDataSource') {
          unrx.kill(this, e.prev);
          if (this.sort && this.sort.active) {
            this.onSort({ active: this.sort.active, direction: this.sort.direction || 'asc' }, origin);
          }
          table.ds.sortChange
            .pipe(unrx(this, e.curr))
            .subscribe( event => { handleDataSourceSortChange(event); });
        }
      });
  }

  ngOnDestroy(): void {
    this._removePlugin(this.table);
    unrx.kill(this);
  }

  private onSort(sort: Sort, origin: 'ds' | 'click'): void {
    const table = this.table;
    const column = table.columnApi.visibleColumns.find(c => c.id === sort.active);

    if ( origin !== 'click' || !column || !column.sort ) {
      return;
    } else {
      const newSort: PblNgridSortDefinition = { };
      const sortFn = typeof column.sort === 'function' && column.sort;
      if (sort.direction) {
        newSort.order = sort.direction;
      }
      if (sortFn) {
        newSort.sortFn = sortFn;
      }
      const currentSort = table.ds.sort;
      if (column === currentSort.column) {
        const _sort = currentSort.sort || {};
        if (newSort.order === _sort.order) {
          return;
        }
      }
      table.ds.setSort(column, newSort);
    }
  }

}
