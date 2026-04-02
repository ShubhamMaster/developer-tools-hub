import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DeveloperInfo from './components/DeveloperInfo.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import ToolLayout from './components/ToolLayout.jsx';
import toolsConfig from './config/tools.json';
import { toolLoaders } from './config/toolLoaders.js';
import ToolPage from './pages/ToolPage.jsx';

const TOOL_SECTIONS = [
  { id: 'format', label: 'Format / Encode' },
  { id: 'inspect', label: 'Inspect / Decode' },
  { id: 'api', label: 'API / Testing' },
  { id: 'generators', label: 'Generators' },
  { id: 'converters', label: 'Converters' },
];

function HomePage({ tools, sectionsById }) {
  const grouped = useMemo(() => {
    const map = new Map();
    tools.forEach((tool) => {
      if (!map.has(tool.section)) {
        map.set(tool.section, []);
      }
      map.get(tool.section).push(tool);
    });
    map.forEach((items) => items.sort((a, b) => a.label.localeCompare(b.label)));
    return map;
  }, [tools]);

  return (
    <article className="flex min-w-0 flex-col gap-5" aria-label="Home">
      <Helmet>
        <title>Developer Tools Hub</title>
        <meta
          name="description"
          content="Fast, offline-ready developer utilities with a clean, readable workspace."
        />
      </Helmet>

      <section className="ui-card p-5 sm:p-6" aria-labelledby="workspace-heading">
        <h1 id="workspace-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Code-ready tools, one clean workspace
        </h1>
        <p className="ui-muted mt-2 max-w-3xl text-sm sm:text-base">
          Minimal UI inspired by GitHub + Wikipedia: fast navigation, readable panels, and instant search.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Platform highlights">
          <span className="ui-surface px-2.5 py-1">Fast</span>
          <span className="ui-surface px-2.5 py-1">Offline-ready</span>
          <span className="ui-surface px-2.5 py-1">Lightweight</span>
        </div>
      </section>

      <section className="ui-card p-5 sm:p-6" aria-label="Tool directory">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">All tools</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {Array.from(grouped.entries()).map(([sectionId, items]) => (
            <section key={sectionId} aria-label={sectionsById.get(sectionId) || sectionId}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="ui-label">{sectionsById.get(sectionId) || sectionId}</p>
                <span className="ui-badge">{items.length}</span>
              </div>
              <ul className="flex flex-col gap-1">
                {items.map((tool) => (
                  <li key={tool.id}>
                    <Link className="ui-btn w-full justify-start" to={`/tool/${tool.slug}`}>
                      {tool.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}

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
  sections,
  sectionsById,
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
      const labelMatch = tool.label.toLowerCase().includes(query);
      const keywordMatch = Array.isArray(tool.keywords)
        ? tool.keywords.some((keyword) => String(keyword).toLowerCase().includes(query))
        : false;
      return labelMatch || keywordMatch;
    });
  }, [searchQuery, tools]);

  const filteredBySection = useMemo(() => {
    const grouped = new Map(sections.map((section) => [section.id, []]));
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
  }, [sections, visibleTools]);

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
        <ToolLayout
          sidebarCollapsed={isSidebarCollapsed}
          drawerOpen={isMobileSidebarOpen}
          onDrawerClose={() => setIsMobileSidebarOpen(false)}
          drawerSidebar={
            <Sidebar
              variant="drawer"
              collapsed={false}
              sections={sections}
              toolsBySection={filteredBySection}
              totalTools={totalTools}
              visibleToolsCount={visibleTools.length}
            />
          }
          sidebar={
            <Sidebar
              variant="desktop"
              collapsed={isSidebarCollapsed}
              sections={sections}
              toolsBySection={filteredBySection}
              totalTools={totalTools}
              visibleToolsCount={visibleTools.length}
            />
          }
          rightPanel={
            <aside className="ui-card p-4" aria-label="Tool information">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Info</h2>
              <p className="ui-muted mt-2 text-sm">Offline-first. No sign-in. No tracking.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Badges">
                <span className="ui-surface px-2.5 py-1">Fast</span>
                <span className="ui-surface px-2.5 py-1">Offline-ready</span>
                <span className="ui-surface px-2.5 py-1">Lightweight</span>
              </div>
            </aside>
          }
        >
          <Routes>
            <Route index element={<HomePage tools={visibleTools} sectionsById={sectionsById} />} />
            <Route
              path="tool/:toolSlug"
              element={
                <ToolPage
                  toolsBySlug={toolsBySlug}
                  sectionsById={sectionsById}
                  fallbackToolSlug={defaultToolSlug}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <nav className="ui-card p-2 lg:hidden" aria-label="Tool tabs">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {visibleTools.map((tool) => (
                <NavLink
                  key={tool.id}
                  to={`/tool/${tool.slug}`}
                  className={({ isActive }) => `ui-tab ${isActive ? 'ui-tab-active' : ''}`}
                >
                  {tool.label}
                </NavLink>
              ))}
            </div>
          </nav>

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
    return toolsConfig
      .map((tool) => ({
        ...tool,
        slug: tool.slug || tool.id,
        component: toolLoaders[tool.id],
      }))
      .filter((tool) => Boolean(tool.component));
  }, []);

  const toolsBySlug = useMemo(() => {
    const map = new Map();
    tools.forEach((tool) => map.set(tool.slug, tool));
    return map;
  }, [tools]);

  const sectionsById = useMemo(() => {
    return new Map(TOOL_SECTIONS.map((section) => [section.id, section.label]));
  }, []);

  const defaultToolSlug = tools[0]?.slug;

  return (
    <AppLayout
      theme={theme}
      setTheme={setTheme}
      tools={tools}
      sections={TOOL_SECTIONS}
      sectionsById={sectionsById}
      toolsBySlug={toolsBySlug}
      defaultToolSlug={defaultToolSlug}
    />
  );
}
