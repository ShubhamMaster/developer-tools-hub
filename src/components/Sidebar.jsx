import ToolCard from './ToolCard.jsx';

export default function Sidebar({
  collapsed,
  sections,
  toolsBySection,
  activeToolId,
  onSelectTool,
  totalTools,
  visibleToolsCount,
}) {
  // Desktop-only sidebar (mobile uses lightweight tabs).
  // When collapsed, hide the sidebar entirely.
  if (collapsed) {
    return null;
  }

  return (
    <aside className="hidden lg:block lg:sticky lg:top-24" aria-label="Tool sidebar">
      <div className="ui-card flex max-h-[calc(100vh-6.5rem)] flex-col overflow-hidden">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <p className="ui-label">Categories</p>
          <p className="ui-muted mt-1 text-xs">
            {visibleToolsCount} / {totalTools} tools
          </p>
        </div>

        <nav className="flex-1 overflow-auto p-2" aria-label="Tool categories">
          <div className="flex flex-col gap-3">
            {sections.map((section) => {
              const tools = toolsBySection.get(section.id) || [];
              if (tools.length === 0) {
                return null;
              }

              return (
                <section key={section.id} className="px-1" aria-label={section.label}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h2 className="ui-label">{section.label}</h2>
                    <span className="ui-badge">{tools.length}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {tools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        label={tool.label}
                        description={tool.description}
                        active={tool.id === activeToolId}
                        onSelect={() => onSelectTool(tool.id)}
                      />
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
