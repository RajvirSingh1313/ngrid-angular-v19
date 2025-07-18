import { NgPackagerHooksContext, EntryPointTaskContext, HookRegistry } from 'ng-cli-packager-tasks';
import { CopyFile } from 'ng-cli-packager-tasks/dist/tasks/copy-file';
import { Bump } from 'ng-cli-packager-tasks/dist/tasks/bump';

import { updatePathsFromCache } from './base';
import { SassCompile } from './tasks';

const COMPILED_PATH_MAPPINGS: { [key: string]: string[] } = {};
async function compileNgcTransformer(taskContext: EntryPointTaskContext) {
  updatePathsFromCache(taskContext, COMPILED_PATH_MAPPINGS);
}

module.exports = function(ctx: NgPackagerHooksContext, registry: HookRegistry) {
  registry
    .register('compileNgc', { before: compileNgcTransformer })
    .register(CopyFile)
    .register(SassCompile)
    .register(Bump);
}
