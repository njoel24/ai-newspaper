// @ts-nocheck
/** @jsxImportSource react */
import React, { useCallback, useEffect, useState } from 'react';
import './article-ui.css';

type Article = {
  id: string;
  title?: string;
  body?: string;
};

type ArticleViewProps = {
  registerRefreshHandler: (fn: () => Promise<void>) => void;
};

const ArticleView = ({ registerRefreshHandler }: ArticleViewProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      if (!res.ok) {
        setArticles([]);
        return;
      }
      const list = Array.isArray(data) ? data : [];
      setArticles(list);
      if (!selectedId && list.length > 0) {
        setSelectedId(list[0]?.id || null);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  const clearArticles = useCallback(async () => {
    const confirmClear = window.confirm('Clear all articles? This cannot be undone.');
    if (!confirmClear) return;
    setLoading(true);
    try {
      const res = await fetch('/api/articles/clear', { method: 'POST' });
      if (!res.ok) return;
      setArticles([]);
      setSelectedId(null);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const openArticle = useCallback((id: string) => {
    setSelectedId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    registerRefreshHandler(refresh);
  }, [refresh, registerRefreshHandler]);

  useEffect(() => {
    refresh();
  }, []);

  const selectedArticle = articles.find((a) => a.id === selectedId) || null;
  const bodyText = (selectedArticle?.body || '').replace(/\\n/g, '\n');

  return (
    <div className="article-view">
      <header>
        <h3>📰 Articles</h3>
        <div>
            <button onClick={refresh} disabled={loading}>
              Refresh
            </button>
            <button className="secondary" onClick={clearArticles} disabled={loading}>
              Clear
            </button>
          </div>
        </header>

        <div className="layout">
          <div id="list">
            {loading && <p className="empty">Loading...</p>}
            {!loading && articles.length === 0 && <p className="empty">No articles yet.</p>}
            {!loading && articles.length > 0 && (
              <ul>
                {articles.map((article) => (
                  <li
                    key={article.id}
                    className={article.id === selectedId ? 'active' : ''}
                    onClick={() => openArticle(article.id)}
                  >
                    {article.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="detail" id="detail">
            {!selectedArticle && <p className="empty">No article selected.</p>}
            {selectedArticle && (
              <>
                <h4>{selectedArticle.title || 'Untitled'}</h4>
                <pre className="body">{selectedArticle.body || ''}</pre>
              </>
            )}
          </div>
        </div>

        <div className={`modal ${modalOpen ? 'open' : ''}`} aria-hidden={!modalOpen}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-label="Article details">
            <div className="modal-header">
              <h4 className="modal-title">{selectedArticle?.title || 'Untitled'}</h4>
              <button className="close-btn" aria-label="Close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">{bodyText}</div>
          </div>
        </div>
      </div>
  );
};

export default ArticleView;
