import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

function parseHeaders(value) {
  const result = {};
  const lines = value.split('\n').map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    const index = line.indexOf(':');
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    const val = line.slice(index + 1).trim();
    result[key] = val;
  }

  return result;
}

export default function ApiTesterTool() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState('');
  const [useProxy, setUseProxy] = useState(false);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Idle');

  const canHaveBody = useMemo(() => method !== 'GET' && method !== 'DELETE', [method]);

  const runRequest = async () => {
    setStatus('Loading...');
    setOutput('');

    const startedAt = performance.now();

    try {
      let responseText = '';
      let responseStatus = 0;
      let responseStatusText = '';
      let durationMs = 0;

      if (useProxy) {
        const proxyResponse = await fetch('/__proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            method,
            headers: parseHeaders(headers),
            body: canHaveBody && body ? body : undefined,
          }),
        });

        const proxyJson = await proxyResponse.json().catch(() => null);
        if (!proxyResponse.ok || !proxyJson?.ok) {
          const hint = proxyResponse.status === 404
            ? 'Proxy endpoint not available. Use `npm run dev` (proxy is dev-only).'
            : '';
          throw new Error(proxyJson?.error || hint || `Proxy failed (${proxyResponse.status})`);
        }

        responseText = String(proxyJson.body ?? '');
        responseStatus = Number(proxyJson.status) || 0;
        responseStatusText = String(proxyJson.statusText ?? '');
        durationMs = Number(proxyJson.durationMs) || 0;
      } else {
        const response = await fetch(url, {
          method,
          headers: parseHeaders(headers),
          body: canHaveBody && body ? body : undefined,
        });

        responseText = await response.text();
        responseStatus = response.status;
        responseStatusText = response.statusText;
        durationMs = Math.round(performance.now() - startedAt);
      }

      const timingSuffix = durationMs ? ` • ${durationMs}ms` : '';
      setStatus(`${responseStatus} ${responseStatusText}${useProxy ? ' (via proxy)' : ''}${timingSuffix}`);

      try {
        const json = JSON.parse(responseText);
        setOutput(JSON.stringify(json, null, 2));
      } catch {
        setOutput(responseText);
      }
    } catch (error) {
      setStatus('Request failed');

      const message = String(error?.message || 'Request failed');
      const maybeCorsHint = message.includes('Failed to fetch')
        ? `${message}\n\nTip: This is often caused by CORS on live domains. Either use an API that sends CORS headers, or enable “Use dev proxy (CORS)” while running locally with \`npm run dev\`.`
        : message;

      setOutput(maybeCorsHint);
    }
  };

  const isError = status === 'Request failed';

  return (
    <ToolShell
      title="API Tester"
      description="Simple fetch-based request runner for quick endpoint checks."
      controls={
        <>
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="ui-select"
          >
            {METHODS.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-xs ui-muted">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(event) => setUseProxy(event.target.checked)}
            />
            Use dev proxy (CORS)
          </label>
          <button
            type="button"
            onClick={runRequest}
            className="ui-btn-primary"
          >
            Send
          </button>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="code-input"
          />
          <TextPanel label="Headers" value={headers} onChange={setHeaders} placeholder="Header: value" className="h-40" />
          {canHaveBody ? <TextPanel label="Body" value={body} onChange={setBody} placeholder="Request body" className="h-56" /> : null}
        </div>
      }
      outputMeta={status}
      output={
        !output ? (
          <span className="ui-muted">Output appears here</span>
        ) : isError ? (
          <span className="text-red-700">{output}</span>
        ) : (
          <CodeBlock text={output} />
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
