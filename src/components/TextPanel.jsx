import { memo, useMemo, useRef } from 'react';
import { highlightCode } from '../utils/syntaxHighlight.js';

const EDITOR_HIGHLIGHT_LIMIT = 80000;

const TextPanel = memo(function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}) {
  const previewRef = useRef(null);
  const highlighted = useMemo(() => {
    if (!value || value.length > EDITOR_HIGHLIGHT_LIMIT) {
      return '';
    }

    return highlightCode(value);
  }, [value]);

  const syncScroll = (event) => {
    if (!previewRef.current) {
      return;
    }

    previewRef.current.scrollTop = event.target.scrollTop;
    previewRef.current.scrollLeft = event.target.scrollLeft;
  };

  return (
    <label className={`flex h-full flex-col gap-2 ${className}`.trim()}>
      <span className="ui-label">{label}</span>
      {value.length <= EDITOR_HIGHLIGHT_LIMIT ? (
        <div className="code-editor h-full min-h-[280px]">
          <pre
            ref={previewRef}
            className="code-editor-preview"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onScroll={syncScroll}
            placeholder={placeholder}
            className="code-editor-input"
            spellCheck={false}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-h-[280px] w-full resize-none code-input leading-relaxed"
          spellCheck={false}
        />
      )}
    </label>
  );
});

export default TextPanel;
