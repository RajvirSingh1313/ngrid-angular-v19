import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-column-group-example',
  templateUrl: './column-group.component.html',
  styleUrls: ['./column-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-column-group-example', { title: 'Column group' })
export class ColumnGroupExample {
  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
    )
    .headerGroup(
      {
        label: 'Name & Gender',
        columnIds: ['name', 'gender'],
      },
      {
        label: 'Country & Language',
        columnIds: ['country', 'language'],
      },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
