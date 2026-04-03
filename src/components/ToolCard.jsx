import { NavLink } from 'react-router-dom';

export default function ToolCard({
  to,
  label,
  description,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}) {
  const handleFavorite = (event) => {
    if (!onToggleFavorite) return;
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <NavLink
      to={to}
      onClick={onSelect}
      className={({ isActive }) => `ui-sidebar-item ${isActive ? 'ui-sidebar-item-active' : ''}`}
    >
      <span className="flex w-full items-start justify-between gap-2 text-left">
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{label}</span>
          {description ? <span className="ui-muted text-xs">{description}</span> : null}
        </span>
        {onToggleFavorite ? (
          <button
            type="button"
            className="ui-icon-btn"
            aria-label={isFavorite ? 'Unpin tool' : 'Pin tool'}
            onClick={handleFavorite}
          >
            {isFavorite ? 'Unpin' : 'Pin'}
          </button>
        ) : null}
      </span>
    </NavLink>
  );
}
