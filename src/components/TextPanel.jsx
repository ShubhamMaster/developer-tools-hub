import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { highlightCode } from '../utils/syntaxHighlight.js';
import OverLimitNotice from './OverLimitNotice.jsx';

const HIGHLIGHT_WARNING_LIMIT = 80000;

const TextPanel = memo(function TextPanel({
  label,
  value,
  onChange,
  placeholder,
  className = '',
}) {
  const previewRef = useRef(null);
  const [allowLargeHighlight, setAllowLargeHighlight] = useState(false);
  const overLimit = value.length > HIGHLIGHT_WARNING_LIMIT;
  const shouldHighlight = !overLimit || allowLargeHighlight;

  useEffect(() => {
    if (!overLimit && allowLargeHighlight) {
      setAllowLargeHighlight(false);
    }
  }, [allowLargeHighlight, overLimit]);

  const highlighted = useMemo(() => {
    if (!value || !shouldHighlight) {
      return '';
    }

    return highlightCode(value);
  }, [shouldHighlight, value]);

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
      {overLimit && !allowLargeHighlight ? (
        <OverLimitNotice
          message={`Large input (${value.length.toLocaleString()} chars). Syntax highlighting may be slow and can freeze your browser.`}
          actionLabel="Render anyway"
          onAction={() => setAllowLargeHighlight(true)}
        />
      ) : null}
      {shouldHighlight ? (
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
