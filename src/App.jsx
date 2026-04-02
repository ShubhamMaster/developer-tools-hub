import { lazy, Suspense, useMemo, useState } from 'react';

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

  const activeConfig = useMemo(() => TOOL_REGISTRY[activeTool], [activeTool]);
  const ActiveToolComponent = activeConfig.component;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-3 py-5 sm:px-6 lg:px-8">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-cyan-100/60 backdrop-blur-sm sm:p-7">
        <p className="text-xs uppercase tracking-[0.28em] text-teal-700">Developer Tools Hub</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-4xl">Light, fast, developer-first toolbox.</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
          Responsive utility workspace built for instant feedback, low overhead, and modular scalability.
        </p>
      </header>

      <nav className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(TOOL_REGISTRY).map(([key, config]) => {
          const isActive = key === activeTool;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setActiveTool(key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? 'border-teal-700 bg-teal-100 text-teal-900'
                  : 'border-slate-300 bg-white/90 text-slate-700 hover:border-teal-400 hover:text-teal-700'
              }`}
            >
              {config.label}
            </button>
          );
        })}
      </nav>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Loading tool module...
          </div>
        }
      >
        <ActiveToolComponent />
      </Suspense>
    </main>
  );
}
