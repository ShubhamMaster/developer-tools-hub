import { Suspense, useEffect, useMemo, useState } from 'react';
import DeveloperInfo from './components/DeveloperInfo.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ToolLayout from './components/ToolLayout.jsx';
import toolsConfig from './config/tools.json';
import { toolLoaders } from './config/toolLoaders.js';

const TOOL_SECTIONS = [
  { id: 'format', label: 'Format / Encode' },
  { id: 'inspect', label: 'Inspect / Decode' },
  { id: 'api', label: 'API / Testing' },
  { id: 'generators', label: 'Generators' },
  { id: 'converters', label: 'Converters' },
];

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const savedTheme = window.localStorage.getItem('dth-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('dth-theme', theme);
  }, [theme]);

  const tools = useMemo(() => {
    return toolsConfig
      .map((tool) => ({
        ...tool,
        component: toolLoaders[tool.id],
      }))
      .filter((tool) => Boolean(tool.component));
  }, []);

  const toolById = useMemo(() => {
    const map = new Map();
    tools.forEach((tool) => map.set(tool.id, tool));
    return map;
  }, [tools]);

  const totalTools = tools.length;
  const activeConfig = toolById.get(activeTool) ?? tools[0];
  const ActiveToolComponent = activeConfig.component;

  const visibleTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return tools;
    }

    return tools.filter((tool) => {
      const labelMatch = tool.label.toLowerCase().includes(query);
      const keywordMatch = Array.isArray(tool.keywords)
        ? tool.keywords.some((keyword) => String(keyword).toLowerCase().includes(query))
        : false;
      return labelMatch || keywordMatch;
    });
  }, [searchQuery, tools]);

  const toolsBySection = useMemo(() => {
    const grouped = new Map(TOOL_SECTIONS.map((section) => [section.id, []]));
    visibleTools.forEach((tool) => {
      if (!grouped.has(tool.section)) {
        grouped.set(tool.section, []);
      }
      grouped.get(tool.section).push(tool);
    });

    grouped.forEach((sectionTools) => {
      sectionTools.sort((a, b) => a.label.localeCompare(b.label));
    });

    return grouped;
  }, [visibleTools]);

  const handleSelectTool = (toolKey) => {
    setActiveTool(toolKey);
    window.requestAnimationFrame(() => {
      document.getElementById('tool-workspace')?.focus();
    });
  };

  return (
    <div className={`${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <a href="#tool-workspace" className="skip-link">
        Skip to active tool
      </a>

      <Header
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        onOpenDeveloperInfo={() => setIsDeveloperInfoOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8" role="main">
        <ToolLayout
          sidebarCollapsed={isSidebarCollapsed}
          sidebar={
            <Sidebar
              collapsed={isSidebarCollapsed}
              sections={TOOL_SECTIONS}
              toolsBySection={toolsBySection}
              activeToolId={activeTool}
              onSelectTool={handleSelectTool}
              totalTools={totalTools}
              visibleToolsCount={visibleTools.length}
            />
          }
          rightPanel={
            <section className="ui-card p-4" aria-label="Tool information">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tool info</h2>
              <p className="ui-muted mt-1 text-sm">{activeConfig.label}</p>
              {activeConfig.description ? <p className="ui-muted mt-2 text-sm">{activeConfig.description}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Product badges">
                <span className="ui-surface px-2.5 py-1">Fast</span>
                <span className="ui-surface px-2.5 py-1">Offline-ready</span>
                <span className="ui-surface px-2.5 py-1">Lightweight</span>
              </div>
            </section>
          }
        >
          <section className="ui-card p-5 sm:p-6" aria-labelledby="workspace-heading">
            <h1 id="workspace-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Code-ready tools, one clean workspace
            </h1>
            <p className="ui-muted mt-2 max-w-3xl text-sm sm:text-base">
              Clean, scalable layout with instant search, lazy-loaded tools, and consistent code-first panels.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Platform highlights">
              <span className="ui-surface px-2.5 py-1">{totalTools} tools available</span>
              <span className="ui-surface px-2.5 py-1">Fast</span>
              <span className="ui-surface px-2.5 py-1">Offline-ready</span>
              <span className="ui-surface px-2.5 py-1">Lightweight</span>
            </div>
          </section>

          <Suspense
            fallback={
              <div className="ui-card p-8 text-center ui-muted">
                Loading tool module...
              </div>
            }
          >
            <section
              id="tool-workspace"
              tabIndex={-1}
              aria-label={`${activeConfig.label} workspace`}
              className="outline-none"
            >
              <ActiveToolComponent />
            </section>
          </Suspense>

          <footer className="pb-2 text-right text-xs ui-muted">
            <button type="button" className="ui-btn" onClick={() => setIsDeveloperInfoOpen(true)}>
              Built by Shubham Dighe
            </button>
          </footer>
        </ToolLayout>

        <DeveloperInfo open={isDeveloperInfoOpen} onClose={() => setIsDeveloperInfoOpen(false)} />
      </main>
    </div>
  );
}
