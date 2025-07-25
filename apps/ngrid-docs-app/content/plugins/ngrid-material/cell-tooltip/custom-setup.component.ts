import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { createDS, columnFactory,  } from '@perbula/ngrid';
import { PblNgridCellEvent } from '@perbula/ngrid/target-events';

import { Person, DynamicClientApi } from '@perbula/apps/docs-app-lib/client-api';
import { Example } from '@perbula/apps/docs-app-lib';

@Component({
  selector: 'pbl-custom-setup-example',
  templateUrl: './custom-setup.component.html',
  styleUrls: ['./custom-setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-custom-setup-example', { title: 'Custom Setup' })
export class CustomSetupExample {
  columns = columnFactory()
    .default({minWidth: 100})
    .table(
      { prop: 'id', sort: true, width: '40px' },
      { prop: 'name', sort: true },
      { prop: 'gender', width: '50px' },
      { prop: 'birthdate', type: 'date' },
      { prop: 'bio' },

    )
    .build();

  ds = createDS<Person>().onTrigger( () => this.datasource.getPeople(0, 15) ).create();

  constructor(private datasource: DynamicClientApi) { }

  getTooltipMessage(event: PblNgridCellEvent<Person>): string {
    return `${event.colIndex} / ${event.rowIndex} -> ${event.rowIndex % 2 ? 'ODD' : 'EVEN'} ROW\n\n${event.cellTarget.innerText}`;
  }

}
