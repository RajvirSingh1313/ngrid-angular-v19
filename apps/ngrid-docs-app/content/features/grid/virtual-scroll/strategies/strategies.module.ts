import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridDetailRowModule } from '@perbula/ngrid/detail-row';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { FixedSizeExample } from './fixed-size.component';
import { AutoSizeExample } from './auto-size.component';
import { DynamicSizeExample } from './dynamic-size.component';

@NgModule({
  declarations: [ FixedSizeExample, AutoSizeExample, DynamicSizeExample ],
  imports: [
    MatCommonModule,
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDetailRowModule,
  ],
  exports: [ FixedSizeExample, AutoSizeExample, DynamicSizeExample ],
})
@BindNgModule(FixedSizeExample, AutoSizeExample, DynamicSizeExample)
export class StrategiesExampleModule { }
