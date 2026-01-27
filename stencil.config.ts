import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ai-newspaper',
  srcDir: 'src/ui/components',
  tsconfig: 'src/ui/components/article-ui/tsconfig.json',
  devMode: true,
  sourceMap: true,
  outputTargets: [
    {
      type: 'www',
      dir: 'dist/ui/components/article-ui',
      buildDir: 'stencil',
      empty: false,
    },
    {
      type: 'docs-readme',
    },
  ],
};
