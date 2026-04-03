export default function OverLimitNotice({ message, actionLabel = 'Proceed anyway', onAction, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200 ${className}`.trim()}
      role="alert"
    >
      <p className="min-w-[200px] flex-1">{message}</p>
      {onAction ? (
        <button type="button" onClick={onAction} className="ui-btn px-2 py-1 text-xs">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
