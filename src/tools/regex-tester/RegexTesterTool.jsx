import { useEffect, useMemo, useRef, useState } from 'react';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildPreview(text, matches, maxChars = 12000) {
  const clipped = text.slice(0, maxChars);
  if (!matches.length) return escapeHtml(clipped);

  let cursor = 0;
  let html = '';

  for (const match of matches) {
    if (match.index >= clipped.length) break;
    const start = match.index;
    const end = Math.min(match.index + match.value.length, clipped.length);
    if (start < cursor) continue;

    html += escapeHtml(clipped.slice(cursor, start));
    html += `<mark class="rounded bg-teal-200 px-0.5 text-teal-900">${escapeHtml(clipped.slice(start, end))}</mark>`;
    cursor = end;
  }

  html += escapeHtml(clipped.slice(cursor));
  return html;
}

export default function RegexTesterTool() {
  const [text, setText] = useState('Error: 500\nError: 404\nok: 200');
  const [pattern, setPattern] = useState('Error: \\d+');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const workerRef = useRef(null);

  const debouncedText = useDebouncedValue(text, 180);
  const debouncedPattern = useDebouncedValue(pattern, 120);
  const debouncedFlags = useDebouncedValue(flags, 120);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./regexWorker.js', import.meta.url), { type: 'module' });
    const worker = workerRef.current;

    worker.onmessage = (event) => {
      if (event.data.ok) {
        setMatches(event.data.matches);
        setError('');
      } else {
        setMatches([]);
        setError(event.data.error || 'Invalid regex');
      }
    };

    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({
      text: debouncedText,
      pattern: debouncedPattern,
      flags: debouncedFlags,
    });
  }, [debouncedText, debouncedPattern, debouncedFlags]);

  const preview = useMemo(() => buildPreview(text, matches), [text, matches]);
  const copyOutput = async () => {
    await navigator.clipboard.writeText(matches.map((entry) => entry.value).join('\n'));
  };

  return (
    <ToolShell
      title="Regex Tester"
      description="Test expressions against large text with worker-based matching and preview highlights."
      controls={
        <div className="flex flex-wrap gap-2">
          <input
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="Pattern"
            className="w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <input
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            placeholder="Flags"
            className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </div>
      }
      input={
        <label className="flex h-full flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-600">Input Text</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-full min-h-[280px] w-full resize-none field-input font-mono"
            spellCheck={false}
          />
        </label>
      }
      output={
        <OutputPanel
          title="Matches"
          output={matches.length ? `${matches.length} match(es)` : ''}
          onCopy={copyOutput}
          copyDisabled={!matches.length}
          meta={error ? `Error: ${error}` : `${matches.length} match(es)`}
        >
          {error ? (
            <span className="text-red-700">{error}</span>
          ) : (
            <pre dangerouslySetInnerHTML={{ __html: preview }} />
          )}
        </OutputPanel>
      }
    />
  );
}
