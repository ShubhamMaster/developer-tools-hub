export default function ToolShell({ title, description, controls, input, output }) {
  return (
    <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-sm sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">{description}</p>
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
