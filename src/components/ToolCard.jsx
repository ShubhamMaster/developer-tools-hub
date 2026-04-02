import { NavLink } from 'react-router-dom';

export default function ToolCard({ to, label, description, onSelect }) {
  return (
    <NavLink
      to={to}
      onClick={onSelect}
      className={({ isActive }) => `ui-sidebar-item ${isActive ? 'ui-sidebar-item-active' : ''}`}
    >
      <span className="flex flex-col gap-0.5 text-left">
        <span className="text-sm font-medium">{label}</span>
        {description ? <span className="ui-muted text-xs">{description}</span> : null}
      </span>
    </NavLink>
  );
}
