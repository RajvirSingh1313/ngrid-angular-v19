import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridBlockUiModule } from '@perbula/ngrid/block-ui';
import { PblNgridTargetEventsModule } from '@perbula/ngrid/target-events';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { TargetEventsExample } from './target-events.component';
import { FocusAndRangeSelectionExample } from './focus-and-range-selection.component';
import { EnterAndLeaveEventsExample } from './enter-and-leave-events.component';

@NgModule({
  declarations: [ TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule, PblNgridBlockUiModule, PblNgridTargetEventsModule,
  ],
  exports: [ TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample ],
})
@BindNgModule(TargetEventsExample, FocusAndRangeSelectionExample, EnterAndLeaveEventsExample)
export class TargetEventsExampleModule { }
