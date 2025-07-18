import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory, PblNgridSortOrder } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-bs-programmatic-example',
  templateUrl: './programmatic.component.html',
  styleUrls: ['./programmatic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-bs-programmatic-example', { title: 'Programmatic Sorting' })
export class ProgrammaticExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', sort: true, width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(500) ).create();

  constructor(private datasource: DynamicClientApi) {
    this.ds.setSort(this.columns.table.cols[1], { order: 'asc' });
  }

  clear(): void {
    this.ds.setSort();
  }

  toggleActive(columnId: string): void {
    const currentSort = this.ds.sort;
    let order: PblNgridSortOrder = 'asc';
    if (currentSort && currentSort.column && currentSort.column.id === columnId) {
      order = currentSort.sort && currentSort.sort.order as any;
      if (order === 'asc') {
        order = 'desc';
      } else if (order === 'desc') {
        this.clear();
        return;
      } else {
        order = 'asc';
      }
    }
    this.ds.hostGrid.setSort(columnId, { order });
  }

  getNextDirection(key: string): string {
    const sort = this.ds.sort;
    if (!sort.column || sort.column.id !== key) {
      return 'asc';
    } else {
      return sort.sort.order === 'asc' ? 'desc' : 'clear';
    }
  }
}
