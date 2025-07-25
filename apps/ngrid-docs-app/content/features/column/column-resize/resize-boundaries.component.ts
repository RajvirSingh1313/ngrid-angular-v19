import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-resize-boundaries-example',
  templateUrl: './resize-boundaries.component.html',
  styleUrls: ['./resize-boundaries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-resize-boundaries-example', { title: 'Resize Boundaries' })
export class ResizeBoundariesExample {
  columns = columnFactory()
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name', resize: true, minWidth: 100, maxWidth: 300 },
      { prop: 'gender', resize: true, minWidth: 50 },
      { prop: 'birthdate', type: 'date' }
    )
    .build();
  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 500) ).create();

  constructor(private datasource: DynamicClientApi) { }
}
