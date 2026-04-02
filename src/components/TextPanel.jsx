import { memo } from 'react';

const TextPanel = memo(function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}) {
  return (
    <label className={`flex h-full flex-col gap-2 ${className}`.trim()}>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full min-h-[280px] w-full resize-none rounded-xl border border-slate-700 bg-panel px-4 py-3 font-mono text-sm leading-relaxed outline-none transition focus:border-accent"
        spellCheck={false}
      />
    </label>
  );
});

export default TextPanel;
