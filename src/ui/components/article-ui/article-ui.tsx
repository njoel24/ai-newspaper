import { Component, h, Method, State } from '@stencil/core';

@Component({
  tag: 'article-ui',
  styleUrl: 'article-ui.css',
  shadow: true,
})
export class ArticleUI {
  @State() articles: any[] = [];
  @State() selectedId: string | null = null;
  @State() loading = false;
  @State() modalOpen = false;

  async componentWillLoad() {
    if (!this.articles) {
      this.articles = [];
    }
  }

  async componentDidLoad() {
    await this.refresh();
  }

  @Method()
  async refresh() {
    this.loading = true;
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (!res.ok) {
        this.articles = [];
        return;
      }
      this.articles = Array.isArray(data) ? data : [];
      if (!this.selectedId && this.articles.length > 0) {
        this.selectedId = this.articles[0]?.id || null;
      }
    } finally {
      this.loading = false;
    }
  }

  private get selectedArticle() {
    return this.articles.find((a) => a.id === this.selectedId) || null;
  }

  private async clearArticles() {
    const confirmClear = window.confirm('Clear all articles? This cannot be undone.');
    if (!confirmClear) return;
    this.loading = true;
    try {
      const res = await fetch('/api/articles/clear', { method: 'POST' });
      if (!res.ok) return;
      this.articles = [];
      this.selectedId = null;
      this.modalOpen = false;
    } finally {
      this.loading = false;
    }
  }

  private selectArticle(id: string) {
    this.selectedId = id;
    this.modalOpen = true;
  }

  private closeModal() {
    this.modalOpen = false;
  }

  render() {
    const safeArticles = Array.isArray(this.articles) ? this.articles : [];
    const article = this.selectedArticle;
    const bodyText = (article?.body || '').replace(/\\n/g, '\n');

    return (
      <div>
        <header>
          <h3>📰 Articles</h3>
          <div>
            <button onClick={() => this.refresh()}>Refresh</button>
            <button class="secondary" onClick={() => this.clearArticles()}>
              Clear
            </button>
          </div>
        </header>
        <div class="layout">
          <div id="list">
            {this.loading && <p class="empty">Loading...</p>}
            {!this.loading && safeArticles.length === 0 && <p class="empty">No articles yet.</p>}
            {!this.loading && safeArticles.length > 0 && (
              <ul>
                {safeArticles.map((a) => (
                  <li
                    class={a.id === this.selectedId ? 'active' : ''}
                    onClick={() => this.selectArticle(a.id)}
                  >
                    {a.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div class="detail" id="detail">
            {!article && <p class="empty">No article selected.</p>}
            {article && (
              <>
                <h4>{article.title || 'Untitled'}</h4>
                <pre class="body">{article.body || ''}</pre>
              </>
            )}
          </div>
        </div>

        <div class={{ modal: true, open: this.modalOpen }} aria-hidden={String(!this.modalOpen)}>
          <div class="modal-card" role="dialog" aria-modal="true" aria-label="Article details">
            <div class="modal-header">
              <h4 class="modal-title">{article?.title || 'Untitled'}</h4>
              <button class="close-btn" aria-label="Close" onClick={() => this.closeModal()}>
                ✕
              </button>
            </div>
            <div class="modal-body">{bodyText}</div>
          </div>
        </div>
      </div>
    );
  }
}
