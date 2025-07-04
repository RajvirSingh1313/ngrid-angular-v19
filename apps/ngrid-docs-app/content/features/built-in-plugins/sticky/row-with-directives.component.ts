import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-row-with-directives-example',
  templateUrl: './row-with-directives.component.html',
  styleUrls: ['./row-with-directives.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-row-with-directives-example', { title: 'Sticky Rows with Directives' })
export class RowWithDirectivesExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
