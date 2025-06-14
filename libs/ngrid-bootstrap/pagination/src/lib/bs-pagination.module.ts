import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridBsPagination } from './bs-pagination.component';

@NgModule({
    imports: [CommonModule, NgbPaginationModule, PblNgridModule],
    declarations: [PblNgridBsPagination],
    exports: [NgbPaginationModule, PblNgridBsPagination]
})
export class PblNgridBsPaginationModule { }
