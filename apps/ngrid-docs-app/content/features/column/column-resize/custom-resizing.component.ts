import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-custom-resizing-example',
  templateUrl: './custom-resizing.component.html',
  styleUrls: ['./custom-resizing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-custom-resizing-example', { title: 'Custom Resizing' })
export class CustomResizingExample {
  columns = columnFactory()
    .default({ resize: true })
    .table(
      { prop: 'id', wontBudge: true, width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'balance' },
    )
    .headerGroup(
      {
        label: 'Group A',
        columnIds: ['name', 'gender'],
      },
      {
        label: 'Group B',
        columnIds: ['country', 'language'],
      },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
