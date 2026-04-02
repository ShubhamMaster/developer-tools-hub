export default function ToolCard({ label, description, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`ui-sidebar-item ${active ? 'ui-sidebar-item-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="flex flex-col gap-0.5 text-left">
        <span className="text-sm font-medium">{label}</span>
        {description ? <span className="ui-muted text-xs">{description}</span> : null}
      </span>
    </button>
  );
}
