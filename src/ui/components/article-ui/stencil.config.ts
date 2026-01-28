import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ai-newspaper',
  srcDir: '.',
  tsconfig: './tsconfig.json',
  devMode: true,
  sourceMap: true,
  outputTargets: [
    {
      type: 'www',
      dir: '../../../../dist/ui/components/article-ui',
      buildDir: 'stencil',
      empty: false,
    },
    {
      type: 'docs-readme',
    },
  ],
};
