import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('evaluator-ui')
export class EvaluatorUI extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: #ffffff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
      border: 1px solid #e5e7eb;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    h3 {
      margin: 0;
      font-size: 18px;
    }
    button {
      background: #111827;
      color: #fff;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .secondary {
      background: #ef4444;
    }
    .summary {
      background: #f8fafc;
      border-radius: 8px;
      padding: 12px;
      font-size: 14px;
      color: #111827;
    }
  `;

  @state() private summaryText = 'Loading...';
  @state() private busy = false;

  connectedCallback() {
    super.connectedCallback();
    this.refresh();
  }

  private async refresh() {
    this.busy = true;
    this.summaryText = 'Loading...';
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      if (!res.ok) {
        this.summaryText = data?.error || 'Failed to load analytics.';
        return;
      }
      this.summaryText = data?.summary || 'No analytics yet.';
    } catch (err: any) {
      this.summaryText = err?.message || 'Failed to load analytics.';
    } finally {
      this.busy = false;
    }
  }

  private async clearAnalytics() {
    const confirmClear = window.confirm('Clear all analytics? This cannot be undone.');
    if (!confirmClear) return;
    this.busy = true;
    this.summaryText = 'Clearing...';
    try {
      const res = await fetch('/api/analytics/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        this.summaryText = data?.error || 'Failed to clear analytics.';
        return;
      }
      this.summaryText = 'No analytics yet.';
    } catch (err: any) {
      this.summaryText = err?.message || 'Failed to clear analytics.';
    } finally {
      this.busy = false;
    }
  }

  render() {
    return html`
      <header>
        <h3>📊 Analytics</h3>
        <div>
          <button @click=${this.refresh} ?disabled=${this.busy}>Refresh</button>
          <button class="secondary" @click=${this.clearAnalytics} ?disabled=${this.busy}>
            Clear
          </button>
        </div>
      </header>
      <div class="summary">${this.summaryText}</div>
    `;
  }
}
