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
    <section className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-panel p-4">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-xs uppercase tracking-[0.2em] text-slate-600">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          disabled={copyDisabled || !hasOutput}
          className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 transition hover:border-teal-600 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copy
        </button>
      </header>
      {meta ? <p className="text-xs text-slate-600">{meta}</p> : null}
      <div className="min-h-[280px] flex-1 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm leading-relaxed text-slate-900">
        {children || output || 'Output appears here'}
      </div>
    </section>
  );
});

export default OutputPanel;
