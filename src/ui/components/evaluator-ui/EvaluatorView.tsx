import React, { useCallback, useEffect, useState } from 'react';
import evaluatorStyles from './evaluator-ui.css?inline';

type EvaluatorViewProps = {
  showInfo: boolean;
  registerRefreshHandler: (fn: () => Promise<void>) => void;
};

const EvaluatorView = ({ showInfo, registerRefreshHandler }: EvaluatorViewProps) => {
  const [summaryText, setSummaryText] = useState('Loading...');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    setSummaryText('Loading...');
    try {
      const res = await fetch('/api/analytics/summary');
      const data = await res.json();
      if (!res.ok) {
        setSummaryText(data?.error || 'Failed to load analytics.');
        return;
      }
      setSummaryText(data?.summary || 'No analytics yet.');
    } catch (err: any) {
      setSummaryText(err?.message || 'Failed to load analytics.');
    } finally {
      setBusy(false);
    }
  }, []);

  const clearAnalytics = useCallback(async () => {
    const confirmClear = window.confirm('Clear all analytics? This cannot be undone.');
    if (!confirmClear) return;
    setBusy(true);
    setSummaryText('Clearing...');
    try {
      const res = await fetch('/api/analytics/clear', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setSummaryText(data?.error || 'Failed to clear analytics.');
        return;
      }
      setSummaryText('No analytics yet.');
    } catch (err: any) {
      setSummaryText(err?.message || 'Failed to clear analytics.');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    registerRefreshHandler(refresh);
  }, [refresh, registerRefreshHandler]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <style>{evaluatorStyles}</style>
      <header>
        <h3>📊 Analytics</h3>
        <div>
          <button onClick={refresh} disabled={busy}>
            Refresh
          </button>
          <button className="secondary" onClick={clearAnalytics} disabled={busy}>
            Clear
          </button>
        </div>
      </header>
      {showInfo && (
        <div className="info-label" style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', fontSize: '0.9em' }}>
          ℹ️ This component displays analytics and evaluation data from the orchestrator agent.
        </div>
      )}
      <div className="summary">{summaryText}</div>
    </>
  );
};

export default EvaluatorView;
