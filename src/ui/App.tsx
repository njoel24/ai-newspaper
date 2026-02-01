import React, { useRef, useState, lazy, Suspense, useEffect } from 'react';

import './components/trend-ui/trend-ui';

// Load CSS asynchronously using preload
const loadCSSAsync = (href: string) => {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = function() { (this as any).rel = 'stylesheet'; };
    document.head.appendChild(link);
  }
};

loadCSSAsync('/src/packages/article-ui/dist/ArticleView.css');
loadCSSAsync('/src/packages/evaluator-ui/dist/EvaluatorView.css');

// Direct imports from built packages
const ArticleView = lazy(() => import('/src/packages/article-ui/dist/ArticleView.js'));
const EvaluatorView = lazy(() => import('/src/packages/evaluator-ui/dist/EvaluatorView.js'));

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  const trendRef = useRef<HTMLElement | null>(null);
  const evaluatorRef = useRef<any>(null);
  const articleRef = useRef<any>(null);

  const refreshWidgets = async () => {
    await customElements.whenDefined('trend-ui');

    if (trendRef.current && typeof (trendRef.current as any).refresh === 'function') {
      (trendRef.current as any).refresh();
    }
    if (articleRef.current && typeof articleRef.current.refresh === 'function') {
      await articleRef.current.refresh();
    }
    if (evaluatorRef.current && typeof evaluatorRef.current.refresh === 'function') {
      await evaluatorRef.current.refresh();
    }
  };

  const runOrchestrator = async () => {
    setRunning(true);
    setStatus('Running...');
    try {
      const res = await fetch('/api/agents/orchestrator');
      const data = await res.json();
      if (!res.ok) {
        setStatus(data?.error || 'Failed');
        return;
      }
      setStatus('Complete');
      setTimeout(refreshWidgets, 300);
    } catch {
      setStatus('Error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          color-scheme: light;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body {
          margin: 0;
          padding: 24px;
          background: #f6f7fb;
          color: #1f2937;
        }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 24px;
          margin: 0;
        }
        .run-btn {
          background: #111827;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .status {
          margin-left: 12px;
          font-size: 14px;
          color: #6b7280;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <header>
        <h1>🧠 AI Newspaper Dashboard</h1>
        <div>
          <button className="run-btn" onClick={runOrchestrator} disabled={running}>
            Run Orchestrator
          </button>
          <span className="status">{status}</span>
        </div>
      </header>

      <section className="grid">
        <trend-ui ref={trendRef}></trend-ui>
        
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Article...</div>}>
          <ArticleView registerRefreshHandler={(fn: () => Promise<void>) => {
            articleRef.current = { refresh: fn };
          }} />
        </Suspense>
        
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Evaluator...</div>}>
          <EvaluatorView 
            showInfo={true}
            registerRefreshHandler={(fn: () => Promise<void>) => {
              evaluatorRef.current = { refresh: fn };
            }}
          />
        </Suspense>
      </section>
    </>
  );
};

export default App;
