import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function getCanonicalHref() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.location.href;
}

export default function Dashboard({ groupedTools, totalTools, visibleToolsCount }) {
  return (
    <article className="flex min-w-0 flex-col gap-5" aria-label="Dashboard">
      <Helmet>
        <title>Developer Tools Hub</title>
        <meta
          name="description"
          content="Developer Tools Hub — a local-first toolbox for JSON, JWT, Base64, hashing, and developer workflows."
        />
        {getCanonicalHref() ? <link rel="canonical" href={getCanonicalHref()} /> : null}
        <meta property="og:title" content="Developer Tools Hub" />
        <meta
          property="og:description"
          content="Developer Tools Hub — a local-first toolbox for JSON, JWT, Base64, hashing, and developer workflows."
        />
        <meta property="og:type" content="website" />
        {getCanonicalHref() ? <meta property="og:url" content={getCanonicalHref()} /> : null}
        <meta property="og:site_name" content="Developer Tools Hub" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Developer Tools Hub" />
        <meta
          name="twitter:description"
          content="Developer Tools Hub — a local-first toolbox for JSON, JWT, Base64, hashing, and developer workflows."
        />
      </Helmet>

      <section className="ui-card p-5 sm:p-6" aria-labelledby="workspace-heading">
        <h1
          id="workspace-heading"
          className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl"
        >
          Developer Tools Hub
        </h1>
        <p className="ui-muted mt-2 max-w-3xl text-sm sm:text-base">
          Minimal UI inspired by GitHub + Wikipedia: fast navigation, readable panels, and instant search.
        </p>
        <p className="ui-muted mt-3 text-xs">
          {visibleToolsCount} / {totalTools} tools
        </p>
      </section>

      <section className="ui-card p-5 sm:p-6" aria-label="Tool directory">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">All tools</h2>

        <div className="mt-4 flex flex-col gap-5">
          {Array.from(groupedTools.entries()).map(([category, groupMap]) => (
            <section key={category} aria-label={category}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="ui-label">{category}</p>
                <span className="ui-badge">
                  {Array.from(groupMap.values()).reduce((sum, items) => sum + items.length, 0)}
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {Array.from(groupMap.entries()).map(([group, tools]) => (
                  <section key={group} aria-label={group}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="ui-label">{group}</p>
                      <span className="ui-badge">{tools.length}</span>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {tools.map((tool) => (
                        <li key={tool.slug}>
                          <Link className="ui-btn w-full justify-start" to={`/tool/${tool.slug}`}>
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
