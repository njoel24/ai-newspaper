import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import ArticleView from './ArticleView.js';
import styles from './article-ui.css?inline';

@customElement('article-ui')
export class ArticleUI extends LitElement {
  static styles = unsafeCSS(styles);

  private reactRoot: Root | null = null;
  private refreshHandler: (() => Promise<void>) | null = null;

  async refresh() {
    if (this.refreshHandler) {
      await this.refreshHandler();
    }
  }

  firstUpdated() {
    const container = this.shadowRoot?.querySelector('#react-container') as HTMLDivElement;
    if (container) {
      this.reactRoot = createRoot(container);
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
    super.disconnectedCallback();
    if (this.reactRoot) {
      this.reactRoot.unmount();
      this.reactRoot = null;
    }
    this.refreshHandler = null;
  }

  render() {
    return html`<div id="react-container"></div>`;
  }
}
