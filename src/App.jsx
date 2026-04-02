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
};

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
  const [theme, setTheme] = useState('light');
  const [isDeveloperInfoOpen, setIsDeveloperInfoOpen] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('dth-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('dth-theme', theme);
  }, [theme]);

  const activeConfig = useMemo(() => TOOL_REGISTRY[activeTool], [activeTool]);
  const ActiveToolComponent = activeConfig.component;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8">
      <header className="ui-card overflow-hidden p-5 backdrop-blur-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-teal-700 dark:text-cyan-300">Developer Tools Hub</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">Light, fast, developer-first toolbox.</h1>
            <p className="ui-muted mt-2 max-w-3xl text-sm sm:text-base">
              Responsive utility workspace built for instant feedback, low overhead, and modular scalability.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            className="ui-btn"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
          <button
            type="button"
            onClick={() => setIsDeveloperInfoOpen(true)}
            className="ui-btn"
          >
            About Developer
          </button>
        </div>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(TOOL_REGISTRY).map(([key, config]) => {
          const isActive = key === activeTool;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setActiveTool(key)}
              className={`ui-tab ${isActive ? 'ui-tab-active' : ''}`}
            >
              {config.label}
            </button>
          );
        })}
      </nav>

      <Suspense
        fallback={
          <div className="ui-card p-8 text-center ui-muted">
            Loading tool module...
          </div>
        }
      >
        <ActiveToolComponent />
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
