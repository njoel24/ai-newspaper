import React, { useRef, useState, lazy, Suspense } from 'react';
import './styles.css';

import './components/trend-ui/trend-ui';

// Custom component for lazy-loaded modules with Suspense
const LazyComponent = ({ 
  path, 
  fallback = <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>,
  ...props 
}: { path: string; fallback?: React.ReactNode; [key: string]: any }) => {
  const Component = lazy(() =>
    import(path).then(mod => ({
      default: mod.default(React)
    }))
  );

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  const trendRef = useRef<HTMLElement | null>(null);
  const evaluatorRef = useRef<any>(null);
  const articleRef = useRef<any>(null);

  const refreshWidgets = async () => {
    await Promise.all([
      customElements.whenDefined('trend-ui'),
      customElements.whenDefined('article-ui'),
      customElements.whenDefined('evaluator-ui'),
    ]);

    if (trendRef.current && typeof (trendRef.current as any).refresh === 'function') {
      (trendRef.current as any).refresh();
    }
    if (articleRef.current && typeof (articleRef.current as any).refresh === 'function') {
      (articleRef.current as any).refresh();
    }
    if (evaluatorRef.current && typeof (evaluatorRef.current as any).refresh === 'function') {
      await (evaluatorRef.current as any).refresh();
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
        <LazyComponent 
          path="/src/packages/article-ui/dist/ArticleUI.js"
          ref={articleRef}
          fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Article...</div>}
        />
        <LazyComponent 
          path="/src/packages/evaluator-ui/dist/EvaluatorUI.js"
          ref={evaluatorRef}
          showInfo={true}
          onLoaded={() => console.log('Evaluator UI loaded!')}
          fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Evaluator...</div>}
        />
      </section>
    </>
  );
};

export default App;
