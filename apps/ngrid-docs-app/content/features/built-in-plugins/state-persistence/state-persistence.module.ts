import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridStatePluginModule } from '@perbula/ngrid/state';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { StatePersistenceExample } from './state-persistence.component';

@NgModule({
  declarations: [ StatePersistenceExample ],
  imports: [
    CommonModule,
    MatButtonModule, MatSliderModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridStatePluginModule,
  ],
  exports: [ StatePersistenceExample ],
})
@BindNgModule(StatePersistenceExample)
export class StatePersistenceExampleModule { }
