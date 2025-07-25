import { Directive, TemplateRef } from '@angular/core';
import { PblColumnTypeDefinitionDataMap } from '@perbula/ngrid/core';

import { PblNgridRegistryService } from '../../registry/registry.service';
import { PblNgridCellContext } from '../../context/index';
import { PblNgridBaseCellDef } from './base-cell-def.directive';

@Directive({
  selector: '[pblNgridCellEditorDef], [pblNgridCellEditorTypeDef]',
  inputs: [
    'name:pblNgridCellEditorDef',
    'type:pblNgridCellEditorTypeDef',
  ],
  standalone: false,
})
export class PblNgridEditorCellDefDirective<T, P extends keyof PblColumnTypeDefinitionDataMap = any> extends PblNgridBaseCellDef<PblNgridCellContext<T, P>> {
  type: P = undefined!;
  constructor(tRef: TemplateRef<PblNgridCellContext<any, P>>, registry: PblNgridRegistryService) { super(tRef, registry); }

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    this.registry.addMulti('editorCell', this);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti('editorCell', this);
  }
}

declare module '@perbula/ngrid/core/lib/registry/types' {
  interface PblNgridMultiRegistryMap {
    editorCell?: PblNgridEditorCellDefDirective<any>;
  }
}
