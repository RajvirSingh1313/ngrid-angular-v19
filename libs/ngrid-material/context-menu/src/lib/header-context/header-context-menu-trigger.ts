import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { PblNgridDataHeaderExtensionContext } from '@perbula/ngrid';
import { PblNgridOverlayPanelConfig } from '@perbula/ngrid/overlay-panel';

import { PblNgridMatHeaderContextMenuPlugin } from './header-context-menu.directive';

const DEFAULT_CONFIG: PblNgridOverlayPanelConfig = { hasBackdrop: true, xPos: 'after', yPos: 'below' };

@Component({
  selector: 'div[mat-header-context-menu-trigger]',
  host: {
    class: 'mat-header-context-menu-trigger',
    '(click)': 'openOverlayPanel()',
  },
  standalone: false,
  templateUrl: `./header-context-menu-trigger.html`,
  styleUrls: [ `./header-context-menu-trigger.scss` ],
  encapsulation: ViewEncapsulation.None,
})
export class MatHeaderContextMenuTrigger {

  context: PblNgridDataHeaderExtensionContext;

  constructor(private plugin: PblNgridMatHeaderContextMenuPlugin, private elRef: ElementRef<HTMLElement>) { }

  openOverlayPanel() {
    const config = this.plugin.config || DEFAULT_CONFIG;
    this.plugin.overlayPanel.open(this.plugin.style, this.elRef, config, this.context);
  }
}
