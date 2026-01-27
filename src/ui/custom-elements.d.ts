import type React from 'react';

declare namespace JSX {
  interface IntrinsicElements extends React.JSX.IntrinsicElements {
    'trend-ui': any;
    'article-ui': any;
    'evaluator-ui': any;
  }
}

declare module '/components/article-ui/stencil/ai-newspaper.esm.js';
