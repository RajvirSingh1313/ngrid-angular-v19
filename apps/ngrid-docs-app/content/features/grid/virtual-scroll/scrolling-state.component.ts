import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory } from '@perbula/ngrid';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-scrolling-state-example',
  templateUrl: './scrolling-state.component.html',
  styleUrls: ['./scrolling-state.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-scrolling-state-example', { title: 'Scrolling State' })
export class ScrollingStateExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' }
    )
    .build();

  ds = this.createDatasource();

  scrollingState: -1 | 0 | 1 = 0;
  lastScrollDirection: 'START' | 'END';

  constructor(private datasource: DynamicClientApi) { }

  createDatasource() {
    return createDS<Person>()
      .onTrigger( () => this.datasource.getPeople(0, 1500) )
      .create();
  }

  setIsScrolling(state: -1 | 0 | 1) {
    this.scrollingState = state;
    if (state) {
      this.lastScrollDirection = state === 1 ? 'END' : 'START';
    }
  }
}
