export class EvaluatorUI extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <style>
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
        .empty {
          color: #6b7280;
        }
      </style>
      <header>
        <h3>📊 Analytics</h3>
        <div>
          <button id="refreshBtn">Refresh</button>
          <button id="clearBtn" class="secondary">Clear</button>
        </div>
      </header>
      <div id="summary" class="summary">Loading...</div>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('#refreshBtn')!.addEventListener('click', () => this.refresh());
    this.shadowRoot!.querySelector('#clearBtn')!.addEventListener('click', () => this.clearAnalytics());
    this.refresh();
  }

  async refresh() {
    const summaryEl = this.shadowRoot!.querySelector('#summary') as HTMLElement;
    summaryEl.textContent = 'Loading...';
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      if (!res.ok) {
        summaryEl.textContent = data?.error || 'Failed to load analytics.';
        return;
      }
      summaryEl.textContent = data?.summary || 'No analytics yet.';
    } catch (err: any) {
      summaryEl.textContent = err?.message || 'Failed to load analytics.';
    }
  }

  private async clearAnalytics() {
    const confirmClear = confirm('Clear all analytics? This cannot be undone.');
    if (!confirmClear) return;

    const summaryEl = this.shadowRoot!.querySelector('#summary') as HTMLElement;
    summaryEl.textContent = 'Clearing...';
    try {
      const res = await fetch('/api/analytics/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        summaryEl.textContent = data?.error || 'Failed to clear analytics.';
        return;
      }
      summaryEl.textContent = 'No analytics yet.';
    } catch (err: any) {
      summaryEl.textContent = err?.message || 'Failed to clear analytics.';
    }
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('evaluator-ui', EvaluatorUI as any);
}
