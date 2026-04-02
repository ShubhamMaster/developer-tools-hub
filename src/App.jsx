import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import DeveloperInfo from './components/DeveloperInfo.jsx';

const JsonFormatterTool = lazy(() => import('./tools/json-formatter/JsonFormatterTool.jsx'));
const Base64Tool = lazy(() => import('./tools/base64/Base64Tool.jsx'));
const JwtDecoderTool = lazy(() => import('./tools/jwt-decoder/JwtDecoderTool.jsx'));
const RegexTesterTool = lazy(() => import('./tools/regex-tester/RegexTesterTool.jsx'));
const ApiTesterTool = lazy(() => import('./tools/api-tester/ApiTesterTool.jsx'));
const UrlInspectorTool = lazy(() => import('./tools/url-inspector/UrlInspectorTool.jsx'));
const TimestampConverterTool = lazy(() => import('./tools/timestamp-converter/TimestampConverterTool.jsx'));
const UuidGeneratorTool = lazy(() => import('./tools/uuid/UuidGeneratorTool.jsx'));
const UrlConverterTool = lazy(() => import('./tools/url-converter/UrlConverterTool.jsx'));
const CaseConverterTool = lazy(() => import('./tools/case-converter/CaseConverterTool.jsx'));
const NumberBaseConverterTool = lazy(() => import('./tools/number-base-converter/NumberBaseConverterTool.jsx'));

const TOOL_REGISTRY = {
  json: {
    label: 'JSON Formatter',
    component: JsonFormatterTool,
  },
  base64: {
    label: 'Base64',
    component: Base64Tool,
  },
  jwt: {
    label: 'JWT Decoder',
    component: JwtDecoderTool,
  },
  regex: {
    label: 'Regex Tester',
    component: RegexTesterTool,
  },
  api: {
    label: 'API Tester',
    component: ApiTesterTool,
  },
  url: {
    label: 'URL Inspector',
    component: UrlInspectorTool,
  },
  time: {
    label: 'Timestamp',
    component: TimestampConverterTool,
  },
  uuid: {
    label: 'UUID Generator',
    component: UuidGeneratorTool,
  },
  urlcodec: {
    label: 'URL Encode/Decode',
    component: UrlConverterTool,
  },
  case: {
    label: 'Case Converter',
    component: CaseConverterTool,
  },
  numberbase: {
    label: 'Number Base',
    component: NumberBaseConverterTool,
  },
};

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
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

  const activeConfig = useMemo(() => TOOL_REGISTRY[activeTool], [activeTool]);
  const ActiveToolComponent = activeConfig.component;
  const totalTools = useMemo(() => Object.keys(TOOL_REGISTRY).length, []);

  return (
    <main className={`mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8 ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <a href="#tool-workspace" className="skip-link">
        Skip to active tool
      </a>

      <header className="ui-card p-3 sm:p-4" role="banner">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-teal-700 dark:text-cyan-300">Developer Tools Hub</p>
            <p className="ui-muted text-sm">Fast, accessible developer utilities</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2" aria-label="Header actions">
            <button
              type="button"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              className="ui-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
            <button
              type="button"
              onClick={() => setIsDeveloperInfoOpen(true)}
              className="ui-btn"
              aria-label="Open about developer"
            >
              About Developer
            </button>
          </div>
        </div>

        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Tool navigation">
          {Object.entries(TOOL_REGISTRY).map(([key, config]) => {
            const isActive = key === activeTool;
            return (
              <button
                type="button"
                key={key}
                onClick={() => setActiveTool(key)}
                className={`ui-tab ${isActive ? 'ui-tab-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                aria-pressed={isActive}
              >
                {config.label}
              </button>
            );
          })}
        </nav>
      </header>

      <section className="ui-card p-5 sm:p-6" aria-labelledby="workspace-heading">
        <h1 id="workspace-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          Code-ready tools, one clean workspace.
        </h1>
        <p className="ui-muted mt-2 max-w-3xl text-sm sm:text-base">
          Responsive utility workspace built for instant feedback, low overhead, and terminal-like code clarity.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs" aria-label="Platform highlights">
          <span className="ui-surface px-2.5 py-1">{totalTools} tools available</span>
          <span className="ui-surface px-2.5 py-1">Data converters included</span>
          <span className="ui-surface px-2.5 py-1">Runs fully in-browser</span>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="ui-card p-8 text-center ui-muted">
            Loading tool module...
          </div>
        }
      >
        <section id="tool-workspace" aria-label={`${activeConfig.label} workspace`}>
          <ActiveToolComponent />
        </section>
      </Suspense>

      <footer className="pb-2 text-right text-xs ui-muted">
        <button type="button" className="ui-btn" onClick={() => setIsDeveloperInfoOpen(true)}>
          Creator
        </button>
      </footer>

      <DeveloperInfo open={isDeveloperInfoOpen} onClose={() => setIsDeveloperInfoOpen(false)} />
    </main>
  );
}
