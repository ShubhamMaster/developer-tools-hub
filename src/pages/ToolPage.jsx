import { Suspense, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function titleFor(tool) {
  return tool ? `Developer Tools Hub — ${tool.name}` : 'Developer Tools Hub';
}

function getCanonicalHref() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.href;
}

export default function ToolPage({
  toolsBySlug,
  fallbackToolSlug,
}) {
  const { toolSlug } = useParams();

  const tool = useMemo(() => {
    return toolsBySlug.get(toolSlug);
  }, [toolsBySlug, toolSlug]);

  if (!tool) {
    return fallbackToolSlug ? <Navigate to={`/tool/${fallbackToolSlug}`} replace /> : null;
  }

  const ToolComponent = tool.component;

  return (
    <article className="flex min-w-0 flex-col gap-3" aria-label={`${tool.name} page`}>
      <Helmet>
        <title>{titleFor(tool)}</title>
        <meta name="description" content={tool.description || `${tool.name} tool`} />
        {getCanonicalHref() ? <link rel="canonical" href={getCanonicalHref()} /> : null}
        <meta property="og:title" content={titleFor(tool)} />
        <meta property="og:description" content={tool.description || `${tool.name} tool`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <nav aria-label="Breadcrumb" className="ui-card px-3 py-2">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link className="text-slate-700 hover:text-teal-800 dark:text-slate-200 dark:hover:text-cyan-200" to="/">
              Home
            </Link>
          </li>
          <li className="ui-muted">/</li>
          <li className="ui-muted">{tool.category}</li>
          <li className="ui-muted">/</li>
          <li className="ui-muted">{tool.group}</li>
          <li className="ui-muted">/</li>
          <li className="text-slate-900 dark:text-slate-100">{tool.name}</li>
        </ol>
      </nav>

      <ErrorBoundary
        resetKey={tool.slug}
        fallback={(error, reset) => (
          <section className="ui-card p-6 text-sm" role="alert">
            <p className="text-red-700 font-semibold">Tool failed to load.</p>
            <p className="ui-muted mt-2">
              Your browser ran into a problem rendering this tool.
            </p>
            {error?.message ? (
              <p className="mt-2 text-xs text-red-600">{String(error.message)}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="ui-btn" onClick={reset}>
                Try again
              </button>
              <Link to="/" className="ui-btn">
                Back home
              </Link>
            </div>
          </section>
        )}
      >
        <Suspense
          fallback={
            <div className="ui-card p-8 text-center ui-muted">
              Loading tool module...
            </div>
          }
        >
          <section id="tool-workspace" tabIndex={-1} aria-label={`${tool.name} workspace`} className="outline-none">
            <ToolComponent />
          </section>
        </Suspense>
      </ErrorBoundary>
    </article>
  );
}
