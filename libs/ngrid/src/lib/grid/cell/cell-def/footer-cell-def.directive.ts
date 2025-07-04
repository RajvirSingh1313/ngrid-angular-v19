import { Directive, TemplateRef } from '@angular/core';

import { PblNgridRegistryService } from '../../registry/registry.service';
import { PblNgridMetaCellContext } from '../../context/index';
import { PblNgridBaseCellDef } from './base-cell-def.directive';

@Directive({
  selector: '[pblNgridFooterCellDef], [pblNgridFooterCellTypeDef]',
  inputs: [
    'name:pblNgridFooterCellDef',
    'type:pblNgridFooterCellTypeDef',
  ],
  standalone: false,
})
export class PblNgridFooterCellDefDirective<T> extends PblNgridBaseCellDef<PblNgridMetaCellContext<T>> {
  constructor(tRef: TemplateRef<PblNgridMetaCellContext<T>>, registry: PblNgridRegistryService) { super(tRef, registry); }

  ngOnInit(): void {
    // TODO: listen to property changes (name) and re-register cell
    this.registry.addMulti('footerCell', this);
  }

  ngOnDestroy(): void {
    this.registry.removeMulti('footerCell', this);
  }
}

declare module '@perbula/ngrid/core/lib/registry/types' {
  interface PblNgridMultiRegistryMap {
    footerCell?: PblNgridFooterCellDefDirective<any>;
  }
}
