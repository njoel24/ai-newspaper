declare module '/src/packages/article-ui/dist/ArticleView.js' {
  import { ComponentType } from 'react';
  interface ArticleViewProps {
    registerRefreshHandler: (fn: () => Promise<void>) => void;
  }
  const ArticleView: ComponentType<ArticleViewProps>;
  export default ArticleView;
}

declare module '/src/packages/evaluator-ui/dist/EvaluatorView.js' {
  import { ComponentType } from 'react';
  interface EvaluatorViewProps {
    showInfo: boolean;
    registerRefreshHandler: (fn: () => Promise<void>) => void;
  }
  const EvaluatorView: ComponentType<EvaluatorViewProps>;
  export default EvaluatorView;
}
