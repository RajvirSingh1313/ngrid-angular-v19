import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridBlockUiModule } from '@perbula/ngrid/block-ui';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { EmptyCollectionTemplateExample } from './empty-collection-template.component';
import { AsynchronousEmptySetExample } from './asynchronous-empty-set.component';
import { DynamicSetExample } from './dynamic-set.component';

@NgModule({
  declarations: [ EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample ],
  imports: [
    CommonModule,
    MatRadioModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule,
  ],
  exports: [ EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample ],
})
@BindNgModule(EmptyCollectionTemplateExample, AsynchronousEmptySetExample, DynamicSetExample)
export class EmptyCollectionTemplateExampleModule { }
