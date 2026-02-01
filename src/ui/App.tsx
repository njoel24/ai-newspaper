import React, { useRef, useState, lazy, Suspense, useEffect } from 'react';
import './styles.css?inline';

import './components/trend-ui/trend-ui';

// Direct imports from built packages
const ArticleView = lazy(() => import('../packages/article-ui/dist/ArticleView.js'));
const EvaluatorView = lazy(() => import('../packages/evaluator-ui/dist/EvaluatorView.js'));

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
