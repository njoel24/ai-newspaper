import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import EvaluatorView from './EvaluatorView';
import styles from './evaluator-ui.css?inline';

@customElement('evaluator-ui')
export class EvaluatorUI extends LitElement {
  static styles = unsafeCSS(styles);
  
  @property({ type: Boolean }) showInfo = false;
  @property({ attribute: false }) onLoaded?: () => void;
  
  private reactRoot: Root | null = null;
  private refreshHandler: (() => Promise<void>) | null = null;

  async refresh() {
    if (this.refreshHandler) {
      await this.refreshHandler();
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.reactRoot?.unmount();
    this.reactRoot = null;
    this.refreshHandler = null;
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    const container = this.shadowRoot?.getElementById('react-root');
    if (!container) return;
    this.reactRoot = createRoot(container);
    this.renderReact();
    if (this.onLoaded) {
      this.onLoaded();
    }
  }

  protected updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('showInfo')) {
      this.renderReact();
    }
  }

  private renderReact() {
    if (!this.reactRoot) return;
    this.reactRoot.render(
      <EvaluatorView
        showInfo={this.showInfo}
        registerRefreshHandler={(fn) => {
          this.refreshHandler = fn;
        }}
      />
    );
  }

  render() {
    return html`<div id="react-root"></div>`;
  }
}
