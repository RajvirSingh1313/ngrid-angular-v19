import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PblNgridRegistryService, PblNgridModule } from '@perbula/ngrid';
import { PblNgridDragModule } from '@perbula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@perbula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@perbula/ngrid/block-ui';
import { PblNgridStatePluginModule } from '@perbula/ngrid/state';
import { PblNgridMatSortModule } from '@perbula/ngrid-material/sort';
import { PblNgridCellTooltipModule } from '@perbula/ngrid-material/cell-tooltip';
import { PblNgridCheckboxModule } from '@perbula/ngrid-material/selection-column';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { CommonGridTemplatesModule, CommonGridTemplatesComponent } from '../common-grid-templates';
import { VirtualScrollPerformanceDemoExample } from './virtual-scroll-performance-demo.component';

@NgModule({
  declarations: [ VirtualScrollPerformanceDemoExample ],
  imports: [
    CommonModule,
    MatFormFieldModule, MatSelectModule, MatSliderModule, MatRadioModule, MatCheckboxModule,

    ExampleCommonModule,
    CommonGridTemplatesModule,

    PblNgridModule.withCommon([ { component: CommonGridTemplatesComponent } ]),
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridStatePluginModule,
    PblNgridMatSortModule,
    PblNgridCellTooltipModule,
    PblNgridCheckboxModule,
  ],
  exports: [ VirtualScrollPerformanceDemoExample ],
  providers: [ PblNgridRegistryService ],
})
@BindNgModule(VirtualScrollPerformanceDemoExample)
export class VirtualScrollPerformanceDemoExampleModule { }
