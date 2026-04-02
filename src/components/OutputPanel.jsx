import { memo, useMemo } from 'react';
import CodeBlock from './CodeBlock.jsx';

const OutputPanel = memo(function OutputPanel({
  title,
  output,
  onCopy,
  copyDisabled = false,
  meta,
  children,
}) {
  const hasOutput = useMemo(() => Boolean(output && output.length > 0), [output]);

  return (
    <section className="ui-surface flex h-full flex-col gap-2 p-4">
      <header className="flex items-center justify-between gap-2">
        <h3 className="ui-label">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          disabled={copyDisabled || !hasOutput}
          className="ui-btn px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy
        </button>
      </header>
      {meta ? <p className="ui-muted text-xs font-medium">{meta}</p> : null}
      <div className="code-surface min-h-[280px] flex-1 overflow-auto p-3 font-mono text-sm leading-relaxed">
        {children || (output ? <CodeBlock text={output} /> : 'Output appears here')}
      </div>
    </section>
  );
});

export default OutputPanel;
