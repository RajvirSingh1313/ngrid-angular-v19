import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PblNgridModule } from '@perbula/ngrid';
import { PblNgridDragModule } from '@perbula/ngrid/drag';

import { BindNgModule } from '@perbula/apps/docs-app-lib';
import { ExampleCommonModule } from '@perbula/apps/docs-app-lib/example-common.module';
import { ColumnResizeExample } from './column-resize.component';
import { ResizingWithTheApiExample } from './resizing-with-the-api.component';
import { ResizeBoundariesExample } from './resize-boundaries.component';
import { CustomResizingExample } from './custom-resizing.component';

@NgModule({
  declarations: [ ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample ],
  imports: [
    CommonModule,
    ExampleCommonModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
  ],
  exports: [ ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample ],
})
@BindNgModule(ColumnResizeExample, ResizingWithTheApiExample, ResizeBoundariesExample, CustomResizingExample)
export class ColumnResizeExampleModule { }
