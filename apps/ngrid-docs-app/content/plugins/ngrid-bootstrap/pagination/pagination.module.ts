import { NgModule } from '@angular/core';
import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridBsPaginationModule } from '@perbula/ngrid-bootstrap/pagination';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { PblNgridDocsAppBootstrapStylesModule } from '../bootstrap-styles.module';
import { PaginationExample } from './pagination.component';
import { AsyncPageNumberExample } from './async-page-number.component';
import { AsyncTokenExample } from './async-token.component';

@NgModule({
  declarations: [ PaginationExample, AsyncPageNumberExample, AsyncTokenExample ],
  imports: [
    PblNgridDocsAppBootstrapStylesModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridBsPaginationModule,
  ],
  exports: [ PaginationExample, AsyncPageNumberExample, AsyncTokenExample ],
})
@BindNgModule(PaginationExample, AsyncPageNumberExample, AsyncTokenExample)
export class PaginationExampleModule { }
