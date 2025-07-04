import { EmbeddedViewRef } from '@angular/core';
import { unrx } from '@perbula/ngrid/core';
import { PblNgridInternalExtensionApi } from '../../ext/grid-ext-api';

export function paginationViewLogicap(extApi: PblNgridInternalExtensionApi) {
  const paginationKillKey = 'pblPaginationKillKey';
  let paginatorEmbeddedVRef: EmbeddedViewRef<any>;

  return () => {
    const ds = extApi.grid.ds;
    const usePagination = ds && extApi.grid.usePagination;

    if (usePagination) {
      ds.pagination = extApi.grid.usePagination || false;
      if (ds.paginator) {
        ds.paginator.noCacheMode = extApi.grid.noCachePaginator;
      }
    }

    if (extApi.grid.isInit) {
      unrx.kill(extApi.grid, paginationKillKey);
      if (paginatorEmbeddedVRef) {
        extApi.grid.removeView(paginatorEmbeddedVRef, 'beforeContent');
        paginatorEmbeddedVRef = undefined;
      }
      if (usePagination) {
        const paginatorTemplate = extApi.registry.getSingle('paginator');
        if (paginatorTemplate) {
          paginatorEmbeddedVRef = extApi.grid.createView('beforeContent', paginatorTemplate.tRef, { $implicit: extApi.grid });
        }
      }
    }
  }
}
