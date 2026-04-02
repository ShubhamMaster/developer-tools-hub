import { memo, useMemo } from 'react';

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
    <section className="flex h-full flex-col gap-2 rounded-xl border border-slate-700 bg-panel p-4">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          disabled={copyDisabled || !hasOutput}
          className="rounded-md border border-slate-600 px-3 py-1 text-xs text-slate-200 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy
        </button>
      </header>
      {meta ? <p className="text-xs text-slate-400">{meta}</p> : null}
      <div className="min-h-[280px] flex-1 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-sm leading-relaxed text-slate-100">
        {children || output || 'Output appears here'}
      </div>
    </section>
  );
});

export default OutputPanel;
