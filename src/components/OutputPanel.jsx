import { memo, useEffect, useMemo, useRef, useState } from 'react';
import CodeBlock from './CodeBlock.jsx';
import { copyTextToClipboard } from '../utils/clipboard.js';

const OutputPanel = memo(function OutputPanel({
  title,
  output,
  onCopy,
  copyDisabled = false,
  actions,
  meta,
  children,
}) {
  const hasOutput = useMemo(() => Boolean(output && output.length > 0), [output]);
  const [copyState, setCopyState] = useState('idle');
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (copyDisabled || !hasOutput) {
      return;
    }

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setCopyState('copying');

    try {
      let ok = true;

      if (typeof onCopy === 'function') {
        const result = await onCopy();
        if (typeof result === 'boolean') {
          ok = result;
        }
      } else {
        ok = await copyTextToClipboard(output);
      }

      if (ok) {
        setCopyState('copied');
        resetTimerRef.current = window.setTimeout(() => {
          setCopyState('idle');
        }, 1400);
      } else {
        setCopyState('idle');
      }
    } catch {
      setCopyState('idle');
    }
  };

  const copyLabel = copyState === 'copied' ? 'Copied' : 'Copy';

  return (
    <section className="ui-surface flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between gap-2">
        <h3 className="ui-label">{title}</h3>
        <div className="flex items-center gap-2">
          {actions}
          <button
            type="button"
            onClick={handleCopy}
            disabled={copyDisabled || !hasOutput}
            className="ui-btn px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copyLabel}
          </button>
        </div>
      </header>
      {meta ? <p className="ui-muted text-xs font-medium">{meta}</p> : null}
      <div className="code-surface min-h-[280px] min-w-0 flex-1 overflow-x-auto overflow-y-auto p-3 font-mono text-sm leading-relaxed">
        {children || (output ? <CodeBlock text={output} /> : 'Output appears here')}
      </div>
    </section>
  );
});

export default OutputPanel;
