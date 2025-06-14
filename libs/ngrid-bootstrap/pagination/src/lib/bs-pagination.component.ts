import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  Optional,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import { unrx } from '@perbula/ngrid/core';
import { PblNgridComponent, PblPaginator, PblPaginatorChangeEvent } from '@perbula/ngrid';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

@Component({
  selector: 'pbl-ngrid-bs-pagination',
  templateUrl: './bs-pagination.component.html',
  styleUrls: ['./bs-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class PblNgridBsPagination implements OnDestroy {
  pages: number[] = [];
  pageSizes: number[] = DEFAULT_PAGE_SIZE_OPTIONS.slice();

  @Input() get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = value;
    this.pageSizes = (value || DEFAULT_PAGE_SIZE_OPTIONS).slice();
    this.updatePageSizes();
  }

  @Input() get paginator(): PblPaginator<number> { return this._paginator; }
  set paginator(value: PblPaginator<number>) {
    if (this._paginator === value) {
      return;
    }
    if (this._paginator) {
      unrx.kill(this, this._paginator);
    }
    this._paginator = value;
    if (value) {
      // pagination.onChange is BehaviorSubject so handlePageChange will trigger
      value.onChange
        .pipe(unrx(this, value))
        .subscribe( event => this.handlePageChange(event) );
      this.updatePageSizes();
    }
  }

  @Input() grid: PblNgridComponent<any>;

  @Input() get hidePageSize(): boolean { return this._hidePageSize; }
  set hidePageSize(value: boolean) { this._hidePageSize = coerceBooleanProperty(value); }

  @Input() get hideRangeSelect(): boolean { return this._hideRangeSelect; }
  set hideRangeSelect(value: boolean) { this._hideRangeSelect = coerceBooleanProperty(value); }

  private _pageSizeOptions: number[];
  private _paginator: PblPaginator<number>;
  private _hidePageSize = false;
  private _hideRangeSelect = false;

  constructor(@Optional() grid: PblNgridComponent<any>, private cdr: ChangeDetectorRef) {
    if (grid) {
      this.grid = grid;
    }
  }

  ngOnDestroy(): void {
    unrx.kill(this);
  }

  _pageChanged(page: number): void {
    this.paginator.page = page;
  }

  _perPageChanged(value: string): void {
    const perPage = parseInt(value, 10);
    this.paginator.perPage = perPage;
  }

  private updatePageSizes(): void {
    if (this.paginator && this.pageSizes.indexOf(this.paginator.perPage) === -1) {
      this.pageSizes.push(this.paginator.perPage);
    }
    this.pageSizes.sort((a, b) => a - b);
  }

  private handlePageChange(event: PblPaginatorChangeEvent): void {
    if (this.pages.length !== this.paginator.totalPages) {
      const pages = this.pages = [];
      for (let i = 1, len = this.paginator.totalPages+1; i<len; i++) { pages.push(i); }
    }
    // this is required here to prevent `ExpressionChangedAfterItHasBeenCheckedError` when the component has or wrapped
    // by an ngIf
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  static ngAcceptInputType_hidePageSize: BooleanInput;
  static ngAcceptInputType_hideRangeSelect: BooleanInput;
}
