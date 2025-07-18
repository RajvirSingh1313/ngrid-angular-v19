import { Observable, of, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { InjectFlags, Injector } from '@angular/core';

import { PblNgridEvents, ON_INIT, PblNgridEventEmitter } from '@perbula/ngrid/core';
import { _PblNgridComponent } from '../tokens';
import {
  PblNgridPlugin,
  PblNgridPluginExtension,
  PblNgridPluginExtensionFactories,
} from './types';
import { PblNgridExtensionApi } from './grid-ext-api';
import { PLUGIN_STORE } from './grid-plugin';

const NGRID_PLUGIN_CONTEXT = new WeakMap<_PblNgridComponent, PblNgridPluginContext>();

const CREATED$ = new Subject<{ table: _PblNgridComponent, controller: PblNgridPluginController<any> }>();

const REGISTERED_TO_CREATE = new WeakSet<any>();

/** @internal */
export class PblNgridPluginContext<T = any> implements PblNgridEventEmitter {

  // workaround, we need a parameter-less constructor since @ngtools/webpack@8.0.4
  // Non @Injectable classes are now getting addded with hard reference to the ctor params which at the class creation point are undefined
  // forwardRef() will not help since it's not inject by angular, we instantiate the class..
  // probably due to https://github.com/angular/angular-cli/commit/639198499973e0f437f059b3c933c72c733d93d8
  static create<T = any>(injector: Injector, extApi: PblNgridExtensionApi) {
    if (NGRID_PLUGIN_CONTEXT.has(extApi.grid)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Grid instance is already registered for extensions.`);
      }
      return;
    }

    const instance = new PblNgridPluginContext<T>();
    NGRID_PLUGIN_CONTEXT.set(extApi.grid, instance);

    instance.grid = extApi.grid;
    instance.injector = injector;
    instance.extApi = extApi;

    instance.controller = new PblNgridPluginController<T>(instance);

    return {
      plugin: instance,
      init: () => CREATED$.next({ table: instance.grid, controller: instance.controller }),
    };
  }

  grid: _PblNgridComponent;
  injector: Injector;
  extApi: PblNgridExtensionApi;
  controller: PblNgridPluginController<T>;
  readonly events: Observable<PblNgridEvents>;
  private _events = new Subject<PblNgridEvents>();

  private constructor() {
    this.events = this._events.asObservable();
  }

  emitEvent(event: PblNgridEvents): void {
    this._events.next(event);
  }

  destroy(): void  {
    if (!NGRID_PLUGIN_CONTEXT.has(this.grid)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Grid is not registered.`);
      }
      return;
    }
    this._events.complete();
    NGRID_PLUGIN_CONTEXT.delete(this.grid);
  }
}

export class PblNgridPluginController<T = any> {

  static readonly created = CREATED$.asObservable();

  static onCreatedSafe(token: any, fn: (grid: _PblNgridComponent, controller: PblNgridPluginController<any>) => void) {
    if (!REGISTERED_TO_CREATE.has(token)) {
      REGISTERED_TO_CREATE.add(token);
      PblNgridPluginController.created.subscribe( event => fn(event.table, event.controller));
    }
  }

  static find<T = any>(grid: _PblNgridComponent<T>): PblNgridPluginController<T> | undefined {
    const context = NGRID_PLUGIN_CONTEXT.get(grid);
    if (context) {
      return context.controller;
    }
  }

  static findPlugin<P extends keyof PblNgridPluginExtension, T = any>(grid: _PblNgridComponent<T>, name: P): PblNgridPluginExtension[P] | undefined {
    return PblNgridPluginController.find(grid)?.getPlugin(name);
  }

  get injector(): Injector { return this.context.injector; }

  readonly extApi: PblNgridExtensionApi
  readonly events: Observable<PblNgridEvents>;
  private readonly grid: _PblNgridComponent<T>
  private readonly plugins = new Map<keyof PblNgridPluginExtension, PblNgridPlugin>();

  constructor(private context: PblNgridPluginContext) {
    this.grid = context.grid;
    this.extApi = context.extApi;
    this.events = context.events;
  }

  /**
   * A Simple shortcut to the `onInit` event which is fired once.
   * If the grid has already been init the event will fire immediately, otherwise it will emit once when `onInit`
   * occurs and cleanup the subscription.
   *
   * The boolean value emitted reflects the state it was emitted on.
   * false - grid was already initialized
   * true - grid was just initialized
   *
   * In other words, if you get false, it means you called this method when the grid was already initialized.
   */
  onInit() {
    return this.grid.isInit ? of(false) : this.events.pipe(ON_INIT, mapTo(true));
  }

  hasPlugin<P extends keyof PblNgridPluginExtension>(name: P): boolean {
    return this.plugins.has(name);
  }

  getPlugin<P extends keyof PblNgridPluginExtension>(name: P): PblNgridPluginExtension[P] | undefined  {
    return this.plugins.get(name) as any;
  }

  ensurePlugin<P extends keyof PblNgridPluginExtension>(name: P): PblNgridPluginExtension[P]  {
    return this.getPlugin(name) || this.createPlugin(name);
  }

  /**
   * Registers the `plugin` with the `name` with the `table`
   */
  setPlugin<P extends keyof PblNgridPluginExtension>(name: P, plugin: PblNgridPluginExtension[P]): (table: _PblNgridComponent<any>) => void {
    if (!PLUGIN_STORE.has(name)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Unknown plugin ${name}.`);
      }
      return;
    }
    if (this.plugins.has(name)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Plugin ${name} is already registered for this grid.`);
      }
      return;
    }
    this.plugins.set(name, plugin);
    return (tbl: _PblNgridComponent<any>) => this.grid === tbl && this.plugins.delete(name);
  }

  /**
   * Checks if the grid is declared in a location within the DI that has access to an ancestor token.
   * For example, if we want to use `createPlugin()` only if the grid is defined in a module that has a specific parent module imported into it
   * we will use `hasAncestor(MyParentModule)`
   */
  hasAncestor(token: any) {
    return !!this.injector.get(token, null, InjectFlags.Optional);
  }

  createPlugin<P extends keyof PblNgridPluginExtensionFactories>(name: P): PblNgridPluginExtension[P];
  createPlugin<P extends keyof PblNgridPluginExtension>(name: P): PblNgridPluginExtension[P];
  createPlugin<P extends (keyof PblNgridPluginExtensionFactories & keyof PblNgridPluginExtension)>(name: P): PblNgridPluginExtension[P] {
    if (!PLUGIN_STORE.has(name)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Unknown plugin ${name}.`);
      }
      return;
    }
    const metadata = PLUGIN_STORE.get(name);
    const methodName = metadata.factory;
    if (!methodName) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Invalid plugin configuration for ${name}, no factory metadata.`);
      }
      return;
    } else if (typeof metadata.target[methodName] !== 'function') {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        throw new Error(`Invalid plugin configuration for ${name}, factory metadata does not point to a function.`);
      }
      return;
    }
    return metadata.target[methodName](this.grid, this.context.injector);
  }
}
