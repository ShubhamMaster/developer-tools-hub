import { lazy, useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DeveloperInfo from './components/DeveloperInfo.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import AppLayoutGrid from './components/AppLayout.jsx';
import toolsConfig, { CATEGORY_ORDER } from './config/tools.js';
import ToolPage from './pages/ToolPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function NotFoundPage() {
  return (
    <article className="ui-card p-6" aria-label="Not found">
      <Helmet>
        <title>Developer Tools Hub — Not Found</title>
        <meta name="description" content="Page not found." />
      </Helmet>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">404</h1>
      <p className="ui-muted mt-2">That tool page doesn’t exist.</p>
      <div className="mt-4">
        <Link to="/" className="ui-btn">Go home</Link>
      </div>
    </article>
  );
}

function AppLayout({
  theme,
  setTheme,
  tools,
  toolsBySlug,
  defaultToolSlug,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);
  const location = useLocation();

  const visibleTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return tools;
    }

    return tools.filter((tool) => {
      const labelMatch = tool.name.toLowerCase().includes(query);
      const categoryMatch = tool.category.toLowerCase().includes(query);
      const groupMatch = tool.group.toLowerCase().includes(query);
      const keywordMatch = Array.isArray(tool.keywords)
        ? tool.keywords.some((keyword) => String(keyword).toLowerCase().includes(query))
        : false;
      return labelMatch || categoryMatch || groupMatch || keywordMatch;
    });
  }, [searchQuery, tools]);

  const groupedTools = useMemo(() => {
    const map = new Map();

    visibleTools.forEach((tool) => {
      const category = tool.category || 'DevTools';
      const group = tool.group || 'Tools';

      if (!map.has(category)) {
        map.set(category, new Map());
      }
      const groups = map.get(category);
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group).push(tool);
    });

    map.forEach((groups) => {
      groups.forEach((items) => items.sort((a, b) => a.name.localeCompare(b.name)));
    });

    const ordered = new Map();
    CATEGORY_ORDER.forEach((category) => {
      if (map.has(category)) {
        ordered.set(category, map.get(category));
      }
    });
    Array.from(map.keys())
      .filter((category) => !ordered.has(category))
      .sort((a, b) => a.localeCompare(b))
      .forEach((category) => ordered.set(category, map.get(category)));

    return ordered;
  }, [visibleTools]);

  const totalTools = tools.length;

  useEffect(() => {
    // Close the mobile drawer on navigation.
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

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
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8" role="main">
        <AppLayoutGrid
          sidebarCollapsed={isSidebarCollapsed}
          drawerOpen={isMobileSidebarOpen}
          onDrawerClose={() => setIsMobileSidebarOpen(false)}
          drawerSidebar={
            <Sidebar
              variant="drawer"
              collapsed={false}
              groupedTools={groupedTools}
              totalTools={totalTools}
              visibleToolsCount={visibleTools.length}
            />
          }
          sidebar={
            <Sidebar
              variant="desktop"
              collapsed={isSidebarCollapsed}
              groupedTools={groupedTools}
              totalTools={totalTools}
              visibleToolsCount={visibleTools.length}
            />
          }
        >
          <Routes>
            <Route
              index
              element={
                <Dashboard
                  groupedTools={groupedTools}
                  totalTools={totalTools}
                  visibleToolsCount={visibleTools.length}
                />
              }
            />
            <Route
              path="tool/:toolSlug"
              element={
                <ToolPage
                  toolsBySlug={toolsBySlug}
                  fallbackToolSlug={defaultToolSlug}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <footer className="pb-2 text-right text-xs ui-muted">
            <button type="button" className="ui-btn" onClick={() => setIsDeveloperInfoOpen(true)}>
              Built by Shubham Dighe
            </button>
          </footer>
        </AppLayoutGrid>

        <DeveloperInfo open={isDeveloperInfoOpen} onClose={() => setIsDeveloperInfoOpen(false)} />
      </main>
    </div>
  );
}

export default function App() {
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

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('dth-theme', theme);
  }, [theme]);

  const tools = useMemo(() => {
    const modules = import.meta.glob('./tools/**/*.jsx');

    return toolsConfig
      .map((tool) => {
        const toolSlug = tool.slug;
        const componentPath = `./tools/${tool.component}`;
        const loader = modules[componentPath];

        if (!loader) {
          return null;
        }

        return {
          ...tool,
          id: toolSlug,
          componentPath,
          component: lazy(loader),
        };
      })
      .filter(Boolean);
  }, []);

  const toolsBySlug = useMemo(() => {
    const map = new Map();
    tools.forEach((tool) => map.set(tool.slug, tool));
    return map;
  }, [tools]);

  const defaultToolSlug = tools[0]?.slug;

  return (
    <AppLayout
      theme={theme}
      setTheme={setTheme}
      tools={tools}
      toolsBySlug={toolsBySlug}
      defaultToolSlug={defaultToolSlug}
    />
  );
}
