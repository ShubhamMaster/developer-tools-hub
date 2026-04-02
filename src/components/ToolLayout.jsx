export default function ToolLayout({
  sidebar,
  drawerSidebar,
  sidebarCollapsed = false,
  drawerOpen = false,
  onDrawerClose,
  children,
}) {
  const gridClass = sidebarCollapsed
    ? 'grid gap-5'
    : 'grid gap-5 xl:grid-cols-[280px,1fr]';

  return (
    <div className={gridClass}>
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Tool navigation">
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

      {!sidebarCollapsed ? <div className="hidden min-w-0 xl:block">{sidebar}</div> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
