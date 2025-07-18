import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridBsSortableModule } from '@perbula/ngrid-bootstrap/sort';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { PblNgridDocsAppBootstrapStylesModule } from '../bootstrap-styles.module';
import { SortHeaderExample } from './sort-header.component';
import { ActiveColumnAndDirectionExample } from './active-column-and-direction.component';
import { ProgrammaticExample } from './programmatic.component';

@NgModule({
  declarations: [ SortHeaderExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
  imports: [
    PblNgridDocsAppBootstrapStylesModule,
    CommonModule,
    ExampleCommonModule,
    NgbButtonsModule,
    PblNgridModule,
    PblNgridBsSortableModule,
  ],
  exports: [ SortHeaderExample, ActiveColumnAndDirectionExample, ProgrammaticExample ],
})
@BindNgModule(SortHeaderExample, ActiveColumnAndDirectionExample, ProgrammaticExample)
export class SortHeaderExampleModule { }
