import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
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

const TOOL_SECTIONS = [
  {
    id: 'format',
    label: 'Format / Encode',
    toolKeys: ['json', 'base64', 'urlcodec'],
  },
  {
    id: 'inspect',
    label: 'Inspect / Decode',
    toolKeys: ['jwt', 'url'],
  },
  {
    id: 'test',
    label: 'Test',
    toolKeys: ['regex', 'api'],
  },
  {
    id: 'convert',
    label: 'Converters',
    toolKeys: ['time', 'case', 'numberbase'],
  },
  {
    id: 'generate',
    label: 'Generators',
    toolKeys: ['uuid'],
  },
];

export default function App() {
  const [activeTool, setActiveTool] = useState('json');
  const [openSection, setOpenSection] = useState(null);
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
  const navRef = useRef(null);

  useEffect(() => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('dth-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!openSection) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!navRef.current) {
        return;
      }

      if (!navRef.current.contains(event.target)) {
        setOpenSection(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openSection]);

  const activeConfig = useMemo(() => TOOL_REGISTRY[activeTool], [activeTool]);
  const ActiveToolComponent = activeConfig.component;
  const totalTools = useMemo(() => Object.keys(TOOL_REGISTRY).length, []);

  const handleSelectTool = (toolKey) => {
    setActiveTool(toolKey);
    setOpenSection(null);
    window.requestAnimationFrame(() => {
      document.getElementById('tool-workspace')?.focus();
    });
  };

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

        <nav ref={navRef} className="mt-3 flex flex-wrap gap-2" aria-label="Tool navigation">
          {TOOL_SECTIONS.map((section) => {
            const sectionHasActive = section.toolKeys.includes(activeTool);
            const isOpen = openSection === section.id;

            return (
              <details
                key={section.id}
                open={isOpen}
                onToggle={(event) => {
                  const nextOpen = event.currentTarget.open;
                  setOpenSection(nextOpen ? section.id : null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setOpenSection(null);
                  }
                }}
                className="relative"
              >
                <summary
                  className={`ui-tab list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden ${sectionHasActive ? 'ui-tab-active' : ''}`}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    <span>{section.label}</span>
                    <span className="ui-surface px-2 py-0.5 text-[0.7rem] ui-muted">{section.toolKeys.length}</span>
                  </span>
                </summary>

                <div
                  className="ui-card absolute left-0 z-50 mt-2 w-64 p-2"
                  role="menu"
                  aria-label={`${section.label} tools`}
                >
                  <div className="flex flex-col gap-1">
                    {section.toolKeys.map((toolKey) => {
                      const toolConfig = TOOL_REGISTRY[toolKey];
                      if (!toolConfig) {
                        return null;
                      }

                      const isActive = toolKey === activeTool;
                      return (
                        <button
                          key={toolKey}
                          type="button"
                          role="menuitem"
                          onClick={() => handleSelectTool(toolKey)}
                          className={`ui-btn flex w-full items-center justify-between gap-2 ${isActive ? 'ui-tab-active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span className="text-left">{toolConfig.label}</span>
                          {isActive ? <span className="ui-muted text-xs">Active</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </details>
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
        <section id="tool-workspace" tabIndex={-1} aria-label={`${activeConfig.label} workspace`}>
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
