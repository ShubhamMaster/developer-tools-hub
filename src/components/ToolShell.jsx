import { useEffect, useRef, useState } from 'react';
import ToolLayout from './ToolLayout.jsx';
import ToolPanel from './ToolPanel.jsx';
import { copyTextToClipboard } from '../utils/clipboard.js';

export default function ToolShell({
  title,
  description,
  controls,
  input,
  output,
  inputMeta,
  inputActions,
  outputMeta,
  outputActions,
  outputCopyText,
  outputCopyDisabled = false,
}) {
  const [copyState, setCopyState] = useState('idle');
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const canCopy = Boolean(outputCopyText && outputCopyText.length > 0) && !outputCopyDisabled;

  const handleCopy = async () => {
    if (!canCopy) {
      return;
    }

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setCopyState('copying');
    const ok = await copyTextToClipboard(outputCopyText);

    if (ok) {
      setCopyState('copied');
      resetTimerRef.current = window.setTimeout(() => {
        setCopyState('idle');
      }, 1400);
    } else {
      setCopyState('idle');
    }
  };

  const copyLabel = copyState === 'copied' ? 'Copied' : 'Copy';

  const outputHeaderActions = (
    <>
      {outputActions}
      <button
        type="button"
        onClick={handleCopy}
        disabled={!canCopy}
        className="ui-btn px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copyLabel}
      </button>
    </>
  );

  return (
    <section className="ui-card p-4 sm:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">{title}</h2>
          <p className="ui-muted mt-1 text-sm">{description}</p>
        </div>
        {controls ? <div className="flex flex-wrap items-center gap-2">{controls}</div> : null}
      </header>

      <ToolLayout
        left={
          <ToolPanel title="INPUT" actions={inputActions}>
            {inputMeta ? <p className="ui-muted mb-3 text-xs font-medium">{inputMeta}</p> : null}
            <div className="flex min-h-0 flex-1 flex-col">{input}</div>
          </ToolPanel>
        }
        right={
          <ToolPanel title="OUTPUT" actions={outputHeaderActions}>
            {outputMeta ? <p className="ui-muted mb-3 text-xs font-medium">{outputMeta}</p> : null}
            <div className="code-surface flex min-h-[280px] min-w-0 flex-1 flex-col overflow-x-auto overflow-y-auto p-3 text-sm leading-relaxed">
              {output ?? <span className="ui-muted">Output appears here</span>}
            </div>
          </ToolPanel>
        }
      />
    </section>
  );
}
