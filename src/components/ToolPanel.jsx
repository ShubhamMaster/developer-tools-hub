export default function ToolPanel({ title, actions, children, className = '' }) {
  return (
    <section className={`ui-surface flex h-full flex-col gap-2 p-4 ${className}`.trim()}>
      {title || actions ? (
        <header className="flex items-center justify-between gap-2">
          {title ? <h3 className="ui-label">{title}</h3> : <span />}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
