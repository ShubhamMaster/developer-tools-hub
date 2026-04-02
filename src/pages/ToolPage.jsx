import { Suspense, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function titleFor(tool) {
  return tool ? `Developer Tools Hub — ${tool.label}` : 'Developer Tools Hub';
}

export default function ToolPage({
  toolsBySlug,
  sectionsById,
  fallbackToolSlug,
}) {
  const { toolSlug } = useParams();

  const tool = useMemo(() => {
    return toolsBySlug.get(toolSlug);
  }, [toolsBySlug, toolSlug]);

  if (!tool) {
    return fallbackToolSlug ? <Navigate to={`/tool/${fallbackToolSlug}`} replace /> : null;
  }

  const sectionLabel = sectionsById.get(tool.section) || tool.section;
  const ToolComponent = tool.component;

  return (
    <article className="flex min-w-0 flex-col gap-3" aria-label={`${tool.label} page`}>
      <Helmet>
        <title>{titleFor(tool)}</title>
        <meta name="description" content={tool.description || `${tool.label} tool`} />
      </Helmet>

      <nav aria-label="Breadcrumb" className="ui-card px-3 py-2">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link className="text-slate-700 hover:text-teal-800 dark:text-slate-200 dark:hover:text-cyan-200" to="/">
              Home
            </Link>
          </li>
          <li className="ui-muted">/</li>
          <li className="ui-muted">{sectionLabel}</li>
          <li className="ui-muted">/</li>
          <li className="text-slate-900 dark:text-slate-100">{tool.label}</li>
        </ol>
      </nav>

      <Suspense
        fallback={
          <div className="ui-card p-8 text-center ui-muted">
            Loading tool module...
          </div>
        }
      >
        <section id="tool-workspace" tabIndex={-1} aria-label={`${tool.label} workspace`} className="outline-none">
          <ToolComponent />
        </section>
      </Suspense>
    </article>
  );
}
