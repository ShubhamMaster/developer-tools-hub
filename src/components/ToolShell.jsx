export default function ToolShell({ title, description, controls, input, output }) {
  return (
    <section className="ui-card p-4 backdrop-blur-sm sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <p className="ui-muted text-sm">{description}</p>
        </div>
        {controls ? <div className="flex flex-wrap gap-2">{controls}</div> : null}
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-h-[340px]">{input}</div>
        <div className="min-h-[340px]">{output}</div>
      </div>
    </section>
  );
}
