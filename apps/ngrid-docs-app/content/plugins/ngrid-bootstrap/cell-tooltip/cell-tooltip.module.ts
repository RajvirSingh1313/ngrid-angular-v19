import { NgModule } from '@angular/core';
import { PblNgridBsCellTooltipModule } from '@perbula/ngrid-bootstrap/cell-tooltip';
import { PblNgridModule } from '@perbula/ngrid';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { PblNgridDocsAppBootstrapStylesModule } from '../bootstrap-styles.module';
import { CellTooltipExample } from './cell-tooltip.component';

@NgModule({
  declarations: [ CellTooltipExample ],
  imports: [
    PblNgridDocsAppBootstrapStylesModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridBsCellTooltipModule,
  ],
  exports: [ CellTooltipExample ],
})
@BindNgModule(CellTooltipExample)
export class CellTooltipExampleModule { }
