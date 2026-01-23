export class TrendUI extends HTMLElement {
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
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
        }
        li {
          display: flex;
          justify-content: space-between;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 14px;
        }
        .score {
          color: #2563eb;
          font-weight: 600;
        }
        .empty {
          color: #6b7280;
          font-size: 14px;
        }
      </style>
      <header>
        <h3>📈 Latest Trends</h3>
        <div>
          <button id="refreshBtn">Refresh</button>
          <button id="clearBtn" class="secondary">Clear</button>
        </div>
      </header>
      <div id="content"></div>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('#refreshBtn')!.addEventListener('click', () => this.refresh());
    this.shadowRoot!.querySelector('#clearBtn')!.addEventListener('click', () => this.clearTrends());
    this.refresh();
  }

  async refresh() {
    const content = this.shadowRoot!.querySelector('#content') as HTMLElement;
    content.textContent = 'Loading...';
    try {
      const res = await fetch('/api/trends');
      const data = await res.json();
      if (!res.ok) {
        content.textContent = data?.error || 'Failed to load trends.';
        return;
      }

      if (!data || data.length === 0) {
        content.innerHTML = `<p class="empty">No trends available yet.</p>`;
        return;
      }

      const items = data
        .map((t: any) => `
          <li>
            <span>${t.topic}</span>
            <span class="score">${Number(t.score ?? 0).toFixed(2)}</span>
          </li>
        `)
        .join('');
      content.innerHTML = `<ul>${items}</ul>`;
    } catch (err: any) {
      content.textContent = err?.message || 'Failed to load trends.';
    }
  }

  private async clearTrends() {
    const confirmClear = confirm('Clear all trends? This cannot be undone.');
    if (!confirmClear) return;

    const content = this.shadowRoot!.querySelector('#content') as HTMLElement;
    content.textContent = 'Clearing...';
    try {
      const res = await fetch('/api/trends/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        content.textContent = data?.error || 'Failed to clear trends.';
        return;
      }
      content.innerHTML = `<p class="empty">No trends available yet.</p>`;
    } catch (err: any) {
      content.textContent = err?.message || 'Failed to clear trends.';
    }
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('trend-ui', TrendUI as any);
}
