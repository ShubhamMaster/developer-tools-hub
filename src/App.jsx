import { lazy, Suspense, useMemo, useState } from 'react';

const JsonFormatterTool = lazy(() => import('./tools/json-formatter/JsonFormatterTool.jsx'));
const Base64Tool = lazy(() => import('./tools/base64/Base64Tool.jsx'));
const JwtDecoderTool = lazy(() => import('./tools/jwt-decoder/JwtDecoderTool.jsx'));
const RegexTesterTool = lazy(() => import('./tools/regex-tester/RegexTesterTool.jsx'));
const ApiTesterTool = lazy(() => import('./tools/api-tester/ApiTesterTool.jsx'));

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
};

export default function App() {
  const [activeTool, setActiveTool] = useState('json');

  const activeConfig = useMemo(() => TOOL_REGISTRY[activeTool], [activeTool]);
  const ActiveToolComponent = activeConfig.component;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-sm sm:p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Developer Tools Hub</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Fast tools, one workspace.</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-400">
          High-performance string-first utilities for everyday development tasks. Designed for large input sizes
          with worker-based heavy processing.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {Object.entries(TOOL_REGISTRY).map(([key, config]) => {
          const isActive = key === activeTool;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setActiveTool(key)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? 'border-accent bg-accentSoft text-emerald-300'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </nav>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 text-center text-slate-300">
            Loading tool module...
          </div>
        }
      >
        <ActiveToolComponent />
      </Suspense>
    </main>
  );
}
