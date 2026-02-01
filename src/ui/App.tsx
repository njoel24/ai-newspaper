import React, { useRef, useState } from 'react';
import './styles.css';

import './components/trend-ui/trend-ui';

// Lazy load web components natively
const useLazyWebComponent = (path: string, tagName: string) => {
  const [loaded, setLoaded] = React.useState(false);
  
  React.useEffect(() => {
    if (!customElements.get(tagName)) {
      import(path).then(() => {
        customElements.whenDefined(tagName).then(() => setLoaded(true));
      });
    } else {
      setLoaded(true);
    }
  }, [path, tagName]);
  
  return loaded;
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

  const articleLoaded = useLazyWebComponent('/src/packages/article-ui/dist/ArticleUI.js', 'article-ui');
  const evaluatorLoaded = useLazyWebComponent('/src/packages/evaluator-ui/dist/EvaluatorUI.js', 'evaluator-ui');

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
        
        {articleLoaded ? (
          <article-ui ref={articleRef}></article-ui>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading Article...</div>
        )}
        
        {evaluatorLoaded ? (
          <evaluator-ui 
            ref={evaluatorRef}
            showInfo={true}
            onLoaded={() => console.log('Evaluator UI loaded!')}
          ></evaluator-ui>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading Evaluator...</div>
        )}
      </section>
    </>
  );
};

export default App;
