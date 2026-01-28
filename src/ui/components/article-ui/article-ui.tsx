import { Component, h, Method } from '@stencil/core';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ArticleView from './ArticleView';

@Component({
  tag: 'article-ui',
  styleUrl: 'article-ui.css',
  shadow: true,
})
export class ArticleUI {
  private reactRoot: any = null;
  private refreshHandler: (() => Promise<void>) | null = null;
  private container: HTMLDivElement | null = null;

  @Method()
  async refresh() {
    if (this.refreshHandler) {
      await this.refreshHandler();
    }
  }

  async componentDidLoad() {
    if (this.container) {
      this.reactRoot = createRoot(this.container);
      this.reactRoot.render(
        createElement(ArticleView, {
          registerRefreshHandler: (fn: () => Promise<void>) => {
            this.refreshHandler = fn;
          }
        })
      );
    }
  }

  disconnectedCallback() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
    this.refreshHandler = null;
  }

  render() {
    return <div ref={(el) => (this.container = el)}></div>;
  }
}
