import { createComponent } from '@lit/react';
import { ArticleUI as ArticleElement } from './article-ui.js';

// Factory function - receives React from main app to ensure singleton
export default (react: any) => createComponent({
  react,
  tagName: 'article-ui',
  elementClass: ArticleElement,
});
