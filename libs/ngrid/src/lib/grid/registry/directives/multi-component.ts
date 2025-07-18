import { ComponentRef, Type } from '@angular/core';
import { PblNgridMultiRegistryMap } from '@perbula/ngrid/core';

import { PblColumn } from '../../column/model';
import { PblNgridMetaCellContext } from '../../context/index';

export abstract class PblNgridMultiComponentRegistry<T, TKind extends keyof PblNgridMultiRegistryMap> {
  abstract readonly name: string;
  abstract readonly kind: TKind;
  abstract readonly componentType: Type<unknown>;

  /**
   * When set to true the component will be created with projected content.
   * Setting to true does not ensure projection, the projection is determined by the context creating the component.
   *
   * For example, In the context of `dataHeaderExtensions` the projection will be the content of the cell, other implementations
   * might not include a projection.
   */
  readonly projectContent?: boolean;

  onCreated?(context: PblNgridMetaCellContext<any, PblColumn>, cmpRef: ComponentRef<T>): void;
}
