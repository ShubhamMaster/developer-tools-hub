export default function Header({
  theme,
  onToggleTheme,
  onOpenDeveloperInfo,
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  isSidebarCollapsed,
}) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      role="banner"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="ui-btn hidden px-3 py-2 lg:inline-flex"
              aria-label={isSidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {isSidebarCollapsed ? 'Show tools' : 'Hide tools'}
            </button>
            <div className="flex items-center gap-2">
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Developer Tools Hub</p>
              </div>
            </div>
          </div>

          <div className="flex-1 lg:px-8">
            <label className="sr-only" htmlFor="tool-search">
              Search tools
            </label>
            <input
              id="tool-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search tools (e.g. json, uuid, base64...)"
              className="field-input w-full"
              spellCheck={false}
            />
          </div>

          <div className="flex shrink-0 flex-wrap gap-2" aria-label="Header actions">
            <button
              type="button"
              onClick={onToggleTheme}
              className="ui-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={onOpenDeveloperInfo}
              className="ui-btn"
              aria-label="Open about developer"
            >
              About Developer
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
