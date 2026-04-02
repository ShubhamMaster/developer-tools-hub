export default function ToolLayout({
  sidebar,
  drawerSidebar,
  sidebarCollapsed = false,
  drawerOpen = false,
  onDrawerClose,
  children,
  rightPanel,
}) {
  const gridClass = sidebarCollapsed
    ? 'grid gap-5 xl:grid-cols-[1fr,320px]'
    : 'grid gap-5 lg:grid-cols-[320px,1fr] xl:grid-cols-[320px,1fr,320px]';

  return (
    <div className={gridClass}>
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Tool navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close tool navigation"
            onClick={onDrawerClose}
          />
          <div className="absolute left-0 top-0 h-full w-[86vw] max-w-sm p-3">
            {drawerSidebar ?? sidebar}
          </div>
        </div>
      ) : null}

      {!sidebarCollapsed ? <div className="min-w-0">{sidebar}</div> : null}
      <div className="min-w-0">{children}</div>
      <div className="hidden min-w-0 xl:block">
        <div className="xl:sticky xl:top-24">{rightPanel}</div>
      </div>
    </div>
  );
}
