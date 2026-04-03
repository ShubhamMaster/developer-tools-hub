export default function ToolPanel({ title, actions, children, className = '' }) {
  return (
    <section
      className={`ui-surface flex h-full min-h-[360px] min-w-0 flex-col overflow-hidden ${className}`.trim()}
    >
      <header className="flex h-11 items-center justify-between gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
        <h3 className="text-[12px] font-medium tracking-[0.08em] text-slate-700 dark:text-slate-300">
          {title}
        </h3>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="flex min-h-0 flex-1 flex-col p-4">{children}</div>
    </section>
  );
}
