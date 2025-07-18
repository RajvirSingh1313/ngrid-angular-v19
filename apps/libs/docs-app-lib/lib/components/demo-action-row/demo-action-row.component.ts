import { Component, EventEmitter, ViewEncapsulation, Input, ViewChild, TemplateRef, AfterViewInit, Output } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatMenuTrigger } from '@angular/material/menu';

import { PblNgridComponent, AutoSizeToFitOptions } from '@perbula/ngrid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pbl-demo-action-row',
  templateUrl: './demo-action-row.component.html',
  styleUrls: [ './demo-action-row.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DemoActionRowComponent implements AfterViewInit {

  @Input() get filter(): boolean { return this._filter; }
  set filter(value: boolean) { this._filter = coerceBooleanProperty(value); }

  @Input() label: string;

  @Output() refresh = new EventEmitter<void>();

  @ViewChild('actionRow', { read: TemplateRef, static: true }) actionRow: TemplateRef<any>;

  autoSizeColumnToFitOptions: AutoSizeToFitOptions = {
    columnBehavior: (column) => {
      const behavior: AutoSizeToFitOptions = {};
      if (column.minWidth) {
        behavior.keepMinWidth = true;
      }
      if (column.maxWidth) {
        behavior.keepMaxWidth = true;
      }
      return behavior;
    }
  };
  autoSizeColumnToFitOptionsForever = { ...this.autoSizeColumnToFitOptions, forceWidthType: '%' as const };

  @Input() get showFps(): boolean { return this._showFps; }
  set showFps(value: boolean) {
    this._showFps = coerceBooleanProperty(value);
  }

  hasState = false;

  private _filter = false;
  private _showFps = false;

  constructor(public grid: PblNgridComponent<any>) { }

  _refresh(): void {
    if (this.refresh.observers.length > 0) {
      this.refresh.emit();
    } else {
      this.grid.ds.refresh();
    }
  }

  ngAfterViewInit(): void {
    this.grid.createView('beforeTable', this.actionRow);
  }

  actionRowFilter(filterValue: string) {
    this.grid.ds.setFilter(filterValue.trim(), this.grid.columnApi.visibleColumns);
  }

  onFpsToggle(event: MouseEvent, moreMenuTrigger: MatMenuTrigger): void {
    this.showFps = !this.showFps;
    event.preventDefault();
    event.stopPropagation();
    moreMenuTrigger.closeMenu();
  }

  restore(): void {
    this.grid.columnApi.showColumns(true);
    this.grid.invalidateColumns();
  }

  static ngAcceptInputType_filter: BooleanInput;
  static ngAcceptInputType_showFps: BooleanInput;
}
