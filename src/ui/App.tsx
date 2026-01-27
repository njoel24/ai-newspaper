import React, { useRef, useState } from 'react';
import './styles.css';

import './components/trend-ui/trend-ui';
import './components/evaluator-ui/evaluator-ui';
import '/components/article-ui/stencil/ai-newspaper.esm.js';

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  const trendRef = useRef<HTMLElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const evaluatorRef = useRef<HTMLElement | null>(null);

  const refreshWidgets = async () => {
    await Promise.all([
      customElements.whenDefined('trend-ui'),
      customElements.whenDefined('article-ui'),
      customElements.whenDefined('evaluator-ui'),
    ]);

    [trendRef.current, articleRef.current, evaluatorRef.current].forEach((el) => {
      if (el && typeof (el as any).refresh === 'function') {
        (el as any).refresh();
      }
    });
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
        <trend-ui ref={trendRef as any}></trend-ui>
        <article-ui ref={articleRef as any}></article-ui>
        <evaluator-ui ref={evaluatorRef as any}></evaluator-ui>
      </section>
    </>
  );
};

export default App;
