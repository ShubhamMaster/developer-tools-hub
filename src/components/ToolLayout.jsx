export default function ToolLayout({ sidebar, sidebarCollapsed = false, children, rightPanel }) {
  const gridClass = sidebarCollapsed
    ? 'grid gap-5 xl:grid-cols-[1fr,320px]'
    : 'grid gap-5 lg:grid-cols-[320px,1fr] xl:grid-cols-[320px,1fr,320px]';

  return (
    <div className={gridClass}>
      {!sidebarCollapsed ? <div className="min-w-0">{sidebar}</div> : null}
      <div className="min-w-0">{children}</div>
      <div className="hidden min-w-0 xl:block">
        <div className="xl:sticky xl:top-24">{rightPanel}</div>
      </div>
    </div>
  );
}
