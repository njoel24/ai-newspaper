import { init, loadRemote } from '@module-federation/runtime';

// Static registry of known remotes — URLs can be promoted to config/env later
const REMOTE_REGISTRY = {
  article_ui: {
    name: 'article_ui',
    entry: '/src/packages/article-ui/dist/remoteEntry.js',
    type: 'module' as const,
  },
  evaluator_ui: {
    name: 'evaluator_ui',
    entry: '/src/packages/evaluator-ui/dist/remoteEntry.js',
    type: 'module' as const,
  },
} as const;

type RemoteName = keyof typeof REMOTE_REGISTRY;

let initialized = false;

function ensureInit() {
  if (initialized) return;
  init({
    name: 'host',
    remotes: Object.values(REMOTE_REGISTRY),
    shared: {
      react: {
        version: '18.3.1',
        scope: 'default',
        lib: () => import('react'),
        shareConfig: { singleton: true, requiredVersion: '^18.3.1' },
      },
      'react-dom': {
        version: '18.3.1',
        scope: 'default',
        lib: () => import('react-dom'),
        shareConfig: { singleton: true, requiredVersion: '^18.3.1' },
      },
      lit: {
        version: '3.3.1',
        scope: 'default',
        lib: () => import('lit'),
        shareConfig: { singleton: true, requiredVersion: '^3.3.1' },
      },
    },
  });
  initialized = true;
}

/**
 * Dynamically loads a micro-frontend module from the known remote registry.
 *
 * @param remote - Key from REMOTE_REGISTRY (e.g. 'article_ui')
 * @param expose - Exposed module path as declared in the remote's federation config (e.g. './ArticleUI')
 * @returns The module's exports
 */
export async function loadMicroFrontend(remote: RemoteName, expose: string): Promise<unknown> {
  ensureInit();
  return loadRemote(`${remote}/${expose}`);
}
