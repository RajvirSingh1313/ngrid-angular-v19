import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-bs-bulk-mode-and-virtual-scroll-example',
  templateUrl: './bulk-mode-and-virtual-scroll.component.html',
  styleUrls: ['./bulk-mode-and-virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-bs-bulk-mode-and-virtual-scroll-example', { title: 'Bulk Mode & Virtual Scroll' })
export class BulkModeAndVirtualScrollExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'selection', width: '48px' },
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'bio' },
      { prop: 'email', minWidth: 250, width: '250px' },
      { prop: 'language', headerType: 'language' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  bulkSelectMode: 'all' | 'view' | 'none' = 'all';

  constructor(private datasource: DynamicClientApi) { }
}
