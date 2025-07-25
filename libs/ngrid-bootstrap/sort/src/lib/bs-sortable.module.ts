import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PblNgridRegistryService, PblNgridModule, ngridPlugin } from '@perbula/ngrid';
import { PblNgridBsSortablePlugin, PLUGIN_KEY } from './bs-sortable-plugin';
import { PblBsSortableExtension } from './bs-sortable-component-extension';
import { PblNgridBsSortable } from './bs-sortable/bs-sortable.component';

@NgModule({
    imports: [CommonModule, PblNgridModule],
    declarations: [PblNgridBsSortablePlugin, PblNgridBsSortable],
    exports: [PblNgridBsSortablePlugin, PblNgridBsSortable]
})
export class PblNgridBsSortableModule {
  static readonly NGRID_PLUGIN = ngridPlugin({ id: PLUGIN_KEY }, PblNgridBsSortablePlugin);

  constructor(private registry: PblNgridRegistryService) {
    registry.addMulti('dataHeaderExtensions', new PblBsSortableExtension());
  }
}
