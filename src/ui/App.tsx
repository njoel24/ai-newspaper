import React, { useRef, useState, useEffect } from 'react';
import './styles.css';

import './components/trend-ui/trend-ui';

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  const trendRef = useRef<HTMLElement | null>(null);
  const evaluatorRef = useRef<any>(null);
  const articleRef = useRef<any>(null);

  useEffect(() => {
    // Lazy load web components
    Promise.all([
      import('../packages/article-ui/dist/article-ui.js'),
      import('../packages/evaluator-ui/dist/evaluator-ui.js')
    ]).then(() => {
      setComponentsLoaded(true);
    });
  }, []);

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
        {componentsLoaded && (
          <>
            <article-ui ref={articleRef}></article-ui>
            <evaluator-ui ref={evaluatorRef} showInfo={true}></evaluator-ui>
          </>
        )}
      </section>
    </>
  );
};

export default App;