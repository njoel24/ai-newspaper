export class ArticleUI extends HTMLElement {
  private articles: any[] = [];
  private selectedId: string | null = null;

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
        .layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 8px;
          max-height: 220px;
          overflow-y: auto;
        }
        li {
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        li.active {
          background: #e0f2fe;
          border: 1px solid #38bdf8;
        }
        .detail {
          background: #f9fafb;
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          color: #111827;
          max-height: 260px;
          overflow-y: auto;
        }
        .detail h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }
        .body {
          white-space: pre-wrap;
          margin: 8px 0 0 0;
        }
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal.open {
          display: flex;
        }
        .modal-card {
          background: #ffffff;
          width: min(960px, 92vw);
          height: min(90vh, 900px);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .modal-title {
          margin: 0;
          font-size: 22px;
        }
        .close-btn {
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .modal-body {
          margin-top: 16px;
          overflow-y: auto;
          white-space: pre-wrap;
          line-height: 1.6;
          font-size: 15px;
        }
        .empty {
          color: #6b7280;
          font-size: 14px;
        }
      </style>
      <header>
        <h3>📰 Articles</h3>
        <div>
          <button id="refreshBtn">Refresh</button>
          <button id="clearBtn" class="secondary">Clear</button>
        </div>
      </header>
      <div class="layout">
        <div id="list"></div>
        <div id="detail" class="detail"></div>
      </div>
      <div class="modal" id="articleModal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" aria-label="Article details">
          <div class="modal-header">
            <h4 class="modal-title" id="modalTitle"></h4>
            <button class="close-btn" id="closeModal" aria-label="Close">✕</button>
          </div>
          <div class="modal-body" id="modalBody"></div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot!.querySelector('#refreshBtn')!.addEventListener('click', () => this.refresh());
    this.shadowRoot!.querySelector('#clearBtn')!.addEventListener('click', () => this.clearArticles());
    this.shadowRoot!.querySelector('#closeModal')!.addEventListener('click', () => this.closeModal());
    this.shadowRoot!.querySelector('#articleModal')!.addEventListener('click', (event) => {
      if (event.target === this.shadowRoot!.querySelector('#articleModal')) {
        this.closeModal();
      }
    });
    this.refresh();
  }

  async refresh() {
    const listEl = this.shadowRoot!.querySelector('#list') as HTMLElement;
    const detailEl = this.shadowRoot!.querySelector('#detail') as HTMLElement;
    listEl.textContent = 'Loading...';
    detailEl.textContent = 'Select an article to view details.';

    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (!res.ok) {
        listEl.textContent = data?.error || 'Failed to load articles.';
        return;
      }

      this.articles = Array.isArray(data) ? data : [];
      if (this.articles.length === 0) {
        listEl.innerHTML = `<p class="empty">No articles yet.</p>`;
        detailEl.textContent = 'No article selected.';
        return;
      }

      if (!this.selectedId) {
        this.selectedId = this.articles[0]?.id || null;
      }

      listEl.innerHTML = `
        <ul>
          ${this.articles
            .map(
              (a) => `
                <li data-id="${a.id}" class="${a.id === this.selectedId ? 'active' : ''}">${a.title}</li>
              `,
            )
            .join('')}
        </ul>
      `;

      listEl.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', () => {
          this.selectedId = (li as HTMLElement).dataset.id || null;
          this.renderDetail();
          listEl.querySelectorAll('li').forEach((el) => el.classList.remove('active'));
          li.classList.add('active');
          this.openModal();
        });
      });

      this.renderDetail();
    } catch (err: any) {
      listEl.textContent = err?.message || 'Failed to load articles.';
      detailEl.textContent = 'No article selected.';
    }
  }

  private renderDetail() {
    const detailEl = this.shadowRoot!.querySelector('#detail') as HTMLElement;
    const article = this.articles.find((a) => a.id === this.selectedId);
    if (!article) {
      detailEl.textContent = 'No article selected.';
      return;
    }
    detailEl.innerHTML = '';

    const title = document.createElement('h4');
    title.textContent = article.title || 'Untitled';

    const body = document.createElement('pre');
    body.className = 'body';
    body.textContent = article.body || '';

    detailEl.appendChild(title);
    detailEl.appendChild(body);

    const modalTitle = this.shadowRoot!.querySelector('#modalTitle') as HTMLElement;
    const modalBody = this.shadowRoot!.querySelector('#modalBody') as HTMLElement;
    modalTitle.textContent = article.title || 'Untitled';
    const bodyText = (article.body || '').replace(/\\n/g, '\n');
    modalBody.textContent = bodyText;
  }

  private openModal() {
    const modal = this.shadowRoot!.querySelector('#articleModal') as HTMLElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  private closeModal() {
    const modal = this.shadowRoot!.querySelector('#articleModal') as HTMLElement;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  private async clearArticles() {
    const confirmClear = confirm('Clear all articles? This cannot be undone.');
    if (!confirmClear) return;

    const listEl = this.shadowRoot!.querySelector('#list') as HTMLElement;
    const detailEl = this.shadowRoot!.querySelector('#detail') as HTMLElement;
    listEl.textContent = 'Clearing...';
    detailEl.textContent = '';

    try {
      const res = await fetch('/api/articles/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        listEl.textContent = data?.error || 'Failed to clear articles.';
        return;
      }
      this.articles = [];
      this.selectedId = null;
      listEl.innerHTML = `<p class="empty">No articles yet.</p>`;
      detailEl.textContent = 'No article selected.';
    } catch (err: any) {
      listEl.textContent = err?.message || 'Failed to clear articles.';
    }
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('article-ui', ArticleUI as any);
}
