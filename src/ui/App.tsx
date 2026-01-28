import React, { useEffect, useRef, useState } from 'react';
import './styles.css';

import './components/trend-ui/trend-ui';
import './components/evaluator-ui/evaluator-ui';

const App = () => {
  const [status, setStatus] = useState('Idle');
  const [running, setRunning] = useState(false);

  const trendRef = useRef<HTMLElement | null>(null);
  const evaluatorRef = useRef<HTMLElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ensureScript = (src: string, isModule: boolean) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return;
      const script = document.createElement('script');
      script.src = src;
      if (isModule) {
        script.type = 'module';
      } else {
        (script as any).noModule = true;
      }
      document.head.appendChild(script);
    };

    ensureScript('/components/article-ui/stencil/ai-newspaper.esm.js', true);
    ensureScript('/components/article-ui/stencil/ai-newspaper.js', false);
  }, []);

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
        <article-ui ref={articleRef}></article-ui>
        <evaluator-ui 
          ref={evaluatorRef} 
          showInfo={true}
          onLoaded={() => console.log('Evaluator UI loaded!')}
        ></evaluator-ui>
      </section>
    </>
  );
};

export default App;
