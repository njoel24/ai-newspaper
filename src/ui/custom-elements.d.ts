import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'trend-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'article-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'evaluator-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { showInfo?: boolean; onLoaded?: () => void }, HTMLElement>;
    }
  }
}
