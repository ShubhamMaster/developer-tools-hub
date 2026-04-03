import ToolCard from './ToolCard.jsx';

export default function Sidebar({
  variant = 'desktop',
  collapsed,
  groupedTools,
  totalTools,
  visibleToolsCount,
}) {
  const isDrawer = variant === 'drawer';

  // Desktop-only sidebar hides when collapsed.
  if (!isDrawer && collapsed) {
    return null;
  }

  return (
    <aside
      className={isDrawer ? 'h-full' : 'xl:sticky xl:top-24'}
      aria-label="Tool sidebar"
    >
      <div className={isDrawer ? 'ui-card flex h-full flex-col overflow-hidden' : 'ui-card flex max-h-[calc(100vh-6.5rem)] flex-col overflow-hidden'}>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <p className="ui-label">Categories</p>
          <p className="ui-muted mt-1 text-xs">
            {visibleToolsCount} / {totalTools} tools
          </p>
        </div>

        <nav className="flex-1 overflow-auto p-2" aria-label="Tool categories">
          <div className="flex flex-col gap-3">
            {Array.from(groupedTools.entries()).map(([category, groupMap]) => {
              const total = Array.from(groupMap.values()).reduce((sum, items) => sum + items.length, 0);
              if (!total) {
                return null;
              }

              return (
                <section key={category} className="px-1" aria-label={category}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="ui-label">{category}</h2>
                    <span className="ui-badge">{total}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {Array.from(groupMap.entries()).map(([group, tools]) => (
                      <section key={group} aria-label={group}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-[11px] font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">
                            {group}
                          </p>
                          <span className="ui-badge">{tools.length}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {tools.map((tool) => (
                            <ToolCard
                              key={tool.slug}
                              to={`/tool/${tool.slug}`}
                              label={tool.name}
                              description={tool.description}
                              onSelect={undefined}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
