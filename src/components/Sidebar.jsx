import { useEffect, useMemo, useRef, useState } from 'react';
import { List } from 'react-window';
import ToolCard from './ToolCard.jsx';

const ROW_HEIGHT = 48;

function getGroupKey(category, group) {
  return `${category}::${group}`;
}

export default function Sidebar({
  variant = 'desktop',
  collapsed,
  groupedTools,
  searchResults = [],
  totalTools,
  visibleToolsCount,
  searchQuery,
  onSearchChange,
  favorites = [],
  recents = [],
  favoriteSlugs = [],
  onToggleFavorite,
  onClearRecents,
}) {
  const isDrawer = variant === 'drawer';
  const categoryKeys = useMemo(() => Array.from(groupedTools.keys()), [groupedTools]);
  const groupKeys = useMemo(() => {
    const keys = [];
    groupedTools.forEach((groupMap, category) => {
      groupMap.forEach((_tools, group) => {
        keys.push(getGroupKey(category, group));
      });
    });
    return keys;
  }, [groupedTools]);

  const [expandedCategories, setExpandedCategories] = useState(() => new Set(categoryKeys));
  const [expandedGroups, setExpandedGroups] = useState(() => new Set(groupKeys));
  const favoriteSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);
  const isSearchActive = Boolean(searchQuery && searchQuery.trim().length > 0);
  const searchResultsSorted = useMemo(
    () => [...searchResults].sort((a, b) => a.name.localeCompare(b.name)),
    [searchResults],
  );

  const listContainerRef = useRef(null);
  const [listSize, setListSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      categoryKeys.forEach((category) => next.add(category));
      return next;
    });
  }, [categoryKeys]);

  useEffect(() => {
    setExpandedGroups((current) => {
      const next = new Set(current);
      groupKeys.forEach((groupKey) => next.add(groupKey));
      return next;
    });
  }, [groupKeys]);

  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;

    const update = () => {
      const rect = container.getBoundingClientRect();
      setListSize({ width: rect.width, height: rect.height });
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const items = [];

    groupedTools.forEach((groupMap, category) => {
      const total = Array.from(groupMap.values()).reduce((sum, list) => sum + list.length, 0);
      if (!total) return;

      items.push({
        id: `category:${category}`,
        type: 'category',
        category,
        total,
      });

      const categoryExpanded = isSearchActive || expandedCategories.has(category);
      if (!categoryExpanded) return;

      groupMap.forEach((tools, group) => {
        const groupKey = getGroupKey(category, group);
        items.push({
          id: `group:${groupKey}`,
          type: 'group',
          category,
          group,
          groupKey,
          total: tools.length,
        });

        const groupExpanded = isSearchActive || expandedGroups.has(groupKey);
        if (!groupExpanded) return;

        tools.forEach((tool) => {
          items.push({
            id: `tool:${tool.slug}`,
            type: 'tool',
            tool,
          });
        });
      });
    });

    return items;
  }, [expandedCategories, expandedGroups, groupedTools, isSearchActive]);

  // Desktop-only sidebar hides when collapsed.
  if (!isDrawer && collapsed) {
    return null;
  }

  const renderRow = ({ index, style }) => {
    const row = rows[index];
    if (!row) return null;

    if (row.type === 'category') {
      const isExpanded = isSearchActive || expandedCategories.has(row.category);
      return (
        <div style={style} className="px-1">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="flex items-center gap-2 text-left"
              onClick={() => {
                setExpandedCategories((current) => {
                  const next = new Set(current);
                  if (next.has(row.category)) {
                    next.delete(row.category);
                  } else {
                    next.add(row.category);
                  }
                  return next;
                });
              }}
              aria-expanded={isExpanded}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                {isExpanded ? 'v' : '>'}
              </span>
              <h2 className="ui-label">{row.category}</h2>
            </button>
            <span className="ui-badge">{row.total}</span>
          </div>
        </div>
      );
    }

    if (row.type === 'group') {
      const isExpanded = isSearchActive || expandedGroups.has(row.groupKey);
      return (
        <div style={style} className="px-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="flex items-center gap-2 text-left"
              onClick={() => {
                setExpandedGroups((current) => {
                  const next = new Set(current);
                  if (next.has(row.groupKey)) {
                    next.delete(row.groupKey);
                  } else {
                    next.add(row.groupKey);
                  }
                  return next;
                });
              }}
              aria-expanded={isExpanded}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {isExpanded ? 'v' : '>'}
              </span>
              <p className="text-[11px] font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">
                {row.group}
              </p>
            </button>
            <span className="ui-badge">{row.total}</span>
          </div>
        </div>
      );
    }

    return (
      <div style={style} className="px-1">
        <ToolCard
          to={`/tool/${row.tool.slug}`}
          label={row.tool.name}
          description={row.tool.description}
          isFavorite={favoriteSet.has(row.tool.slug)}
          onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(row.tool.slug) : undefined}
        />
      </div>
    );
  };

  const toolRowsCount = useMemo(
    () => (isSearchActive ? searchResultsSorted.length : rows.filter((row) => row.type === 'tool').length),
    [isSearchActive, rows, searchResultsSorted.length],
  );

  return (
    <aside
      className={isDrawer ? 'h-full' : 'xl:sticky xl:top-24'}
      aria-label="Tool sidebar"
    >
      <div className={isDrawer ? 'ui-card flex h-full flex-col overflow-hidden' : 'ui-card flex max-h-[calc(100vh-6.5rem)] flex-col overflow-hidden'}>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <p className="ui-label">Categories</p>
          <p className="ui-muted mt-1 text-xs">
            {visibleToolsCount} / {totalTools} tools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="ui-btn px-3 py-1 text-xs"
              onClick={() => {
                setExpandedCategories(new Set(categoryKeys));
                setExpandedGroups(new Set(groupKeys));
              }}
            >
              Expand all
            </button>
            <button
              type="button"
              className="ui-btn px-3 py-1 text-xs"
              onClick={() => {
                setExpandedCategories(new Set());
                setExpandedGroups(new Set());
              }}
            >
              Collapse all
            </button>
          </div>
        </div>

        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter tools"
            className="field-input w-full"
            spellCheck={false}
          />
        </div>

        {!isSearchActive && (favorites.length || recents.length) ? (
          <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-800">
            {favorites.length ? (
              <section className="mb-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="ui-label">Favorites</p>
                  <span className="ui-badge">{favorites.length}</span>
                </div>
                <div className="flex flex-col gap-1">
                  {favorites.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      to={`/tool/${tool.slug}`}
                      label={tool.name}
                      description={tool.description}
                      isFavorite={favoriteSet.has(tool.slug)}
                      onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(tool.slug) : undefined}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {recents.length ? (
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <p className="ui-label">Recents</p>
                  <div className="flex items-center gap-2">
                    <span className="ui-badge">{recents.length}</span>
                    {onClearRecents ? (
                      <button type="button" className="ui-btn px-2 py-1 text-xs" onClick={onClearRecents}>
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {recents.map((tool) => (
                    <ToolCard
                      key={tool.slug}
                      to={`/tool/${tool.slug}`}
                      label={tool.name}
                      description={tool.description}
                      isFavorite={favoriteSet.has(tool.slug)}
                      onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(tool.slug) : undefined}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        <nav className="flex min-h-0 flex-1 flex-col px-2 py-3" aria-label="Tool categories">
          {isSearchActive ? (
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="ui-label">Search results</p>
              <span className="ui-badge">{toolRowsCount}</span>
            </div>
          ) : null}
          <div ref={listContainerRef} className="min-h-0 flex-1">
            {isSearchActive ? (
              <div className="flex flex-col gap-1">
                {searchResultsSorted.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    to={`/tool/${tool.slug}`}
                    label={tool.name}
                    description={tool.description}
                    isFavorite={favoriteSet.has(tool.slug)}
                    onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(tool.slug) : undefined}
                  />
                ))}
              </div>
            ) : listSize.height > 0 && listSize.width > 0 ? (
              <List
                rowCount={rows.length}
                rowHeight={ROW_HEIGHT}
                rowComponent={renderRow}
                rowProps={{}}
                overscanCount={6}
                style={{ height: listSize.height, width: listSize.width }}
              />
            ) : null}
            {isSearchActive && toolRowsCount === 0 ? (
              <div className="px-2 py-4 text-sm ui-muted">No tools match this search.</div>
            ) : null}
          </div>
        </nav>
      </div>
    </aside>
  );
}
