import { useMemo, useState } from 'react';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

function parseTimestamp(value) {
  const raw = value.trim();
  if (!raw) {
    return { iso: '', local: '', utc: '', unixMs: '', unixSec: '' };
  }

  const asNumber = Number(raw);
  const date = Number.isFinite(asNumber)
    ? new Date(raw.length <= 10 ? asNumber * 1000 : asNumber)
    : new Date(raw);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid timestamp or date input.');
  }

  return {
    iso: date.toISOString(),
    local: date.toString(),
    utc: date.toUTCString(),
    unixMs: String(date.getTime()),
    unixSec: String(Math.floor(date.getTime() / 1000)),
  };
}

export default function TimestampConverterTool() {
  const [input, setInput] = useState(String(Date.now()));

  const { output, error } = useMemo(() => {
    try {
      const parsed = parseTimestamp(input);
      return { output: JSON.stringify(parsed, null, 2), error: '' };
    } catch (e) {
      return { output: '', error: e.message };
    }
  }, [input]);

  const useNow = () => setInput(String(Date.now()));

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates."
      controls={
        <button
          type="button"
          onClick={useNow}
          className="ui-btn"
        >
          Use Current Time
        </button>
      }
      input={
        <label className="flex h-full flex-col gap-2">
          <span className="ui-label">Timestamp or Date</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="field-input"
            placeholder="e.g. 1711619552000 or 2026-04-02T10:00:00Z"
          />
        </label>
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Converted result appears here</span>
        )
      }
      outputCopyText={error ? '' : output}
      outputCopyDisabled={Boolean(error) || !output}
    />
  );
}
