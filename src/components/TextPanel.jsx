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
      <span className="text-xs uppercase tracking-[0.2em] text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-full min-h-[280px] w-full resize-none field-input font-mono leading-relaxed"
        spellCheck={false}
      />
    </label>
  );
});

export default TextPanel;
