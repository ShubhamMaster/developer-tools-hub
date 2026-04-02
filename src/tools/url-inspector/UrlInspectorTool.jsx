import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';

function parseQuery(searchParams) {
  const rows = [];
  for (const [key, value] of searchParams.entries()) {
    rows.push({ key, value });
  }
  return rows;
}

export default function UrlInspectorTool() {
  const [input, setInput] = useState('https://example.com:443/products/list?q=keyboard&sort=price#section-2');

  const { output, error, meta } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '', meta: 'Ready' };
    }

    try {
      const parsed = new URL(input.trim());
      const queryRows = parseQuery(parsed.searchParams);
      const model = {
        href: parsed.href,
        protocol: parsed.protocol,
        host: parsed.host,
        hostname: parsed.hostname,
        port: parsed.port || '(default)',
        pathname: parsed.pathname,
        hash: parsed.hash || '(none)',
        queryEntries: queryRows,
      };

      return {
        output: JSON.stringify(model, null, 2),
        error: '',
        meta: `${queryRows.length} query param(s)`,
      };
    } catch (e) {
      return { output: '', error: e.message, meta: 'Invalid URL' };
    }
  }, [input]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      title="URL Inspector"
      description="Break down URL structure and query parameters instantly."
      input={<TextPanel label="URL" value={input} onChange={setInput} placeholder="Paste a full URL" />}
      output={
        <OutputPanel title="Parsed URL" output={output} onCopy={copyOutput} copyDisabled={!output} meta={meta}>
          {error ? <span className="text-red-700">{error}</span> : output || 'Parsed URL appears here'}
        </OutputPanel>
      }
    />
  );
}
