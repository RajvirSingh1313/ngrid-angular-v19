import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-grid-filler-no-virtual-scroll-example',
  templateUrl: './grid-filler-no-virtual-scroll.component.html',
  styleUrls: ['./grid-filler-no-virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-grid-filler-no-virtual-scroll-example', { title: 'Grid Filler No Virtual Scroll' })
export class GridFillerNoVirtualScrollExample {
  columns = columnFactory()
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'email', minWidth: 250, width: '250px' },
      { prop: 'language', headerType: 'language' },
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 3) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
