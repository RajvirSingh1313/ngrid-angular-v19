import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-row-ordering-example',
  templateUrl: './row-ordering.component.html',
  styleUrls: ['./row-ordering.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-row-ordering-example', { title: 'Row Ordering' })
export class RowOrderingExample {
  columns = columnFactory()
    .table(
      { prop: 'drag_and_drop_handle', reorder: true, type: 'drag_and_drop_handle', minWidth: 24, width: '', maxWidth: 24 },
      { prop: 'id', width: '100px' },
      { prop: 'name', width: '100px' },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date', width: '25%' },
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(100, 50) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
