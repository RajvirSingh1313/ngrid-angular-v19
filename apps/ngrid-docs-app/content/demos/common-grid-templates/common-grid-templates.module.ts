import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridDragModule } from '@perbula/ngrid/drag';
import { PblNgridBlockUiModule } from '@perbula/ngrid/block-ui';

import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { CommonGridTemplatesComponent } from './common-grid-templates.component';

@NgModule({
  declarations: [ CommonGridTemplatesComponent ],
  imports: [
    CommonModule,
    MatIconModule, MatProgressSpinnerModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridDragModule.withDefaultTemplates(), PblNgridBlockUiModule,
  ],
  exports: [ CommonGridTemplatesComponent ],
})
export class CommonGridTemplatesModule { }
