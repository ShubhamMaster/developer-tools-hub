import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

function normalizeHeaders(headers) {
  const map = {};
  Object.entries(headers || {}).forEach(([key, value]) => {
    map[String(key).toLowerCase()] = String(value);
  });
  return map;
}

function parseHeaderText(text) {
  const map = {};
  text.split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx <= 0) return;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key) map[key] = value;
  });
  return map;
}

function analyzeCors(headers) {
  const allowOrigin = headers['access-control-allow-origin'] || '';
  const allowMethods = headers['access-control-allow-methods'] || '';
  const allowHeaders = headers['access-control-allow-headers'] || '';
  const allowCredentials = headers['access-control-allow-credentials'] || '';
  const exposeHeaders = headers['access-control-expose-headers'] || '';
  const maxAge = headers['access-control-max-age'] || '';

  const issues = [];
  if (!allowOrigin) {
    issues.push('Missing Access-Control-Allow-Origin.');
  }
  if (allowOrigin === '*' && allowCredentials.toLowerCase() === 'true') {
    issues.push('Credentials cannot be used with wildcard origin.');
  }
  if (!allowMethods) {
    issues.push('Missing Access-Control-Allow-Methods (may block preflight).');
  }
  if (!allowHeaders) {
    issues.push('Missing Access-Control-Allow-Headers for custom headers.');
  }

  return {
    allowOrigin,
    allowMethods,
    allowHeaders,
    allowCredentials,
    exposeHeaders,
    maxAge,
    issues,
    status: issues.length ? 'needs-review' : 'ok',
  };
}

export default function CorsAnalyzerTool() {
  const [url, setUrl] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [useProxy, setUseProxy] = useState(false);
  const [proxyHeaders, setProxyHeaders] = useState(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setError('');
    setProxyHeaders(null);

    if (!useProxy) {
      return;
    }

    if (!url.trim()) {
      setError('Enter a URL to fetch headers.');
      return;
    }

    try {
      const response = await fetch('/__proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method: 'HEAD', headers: {} }),
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.ok) {
        const hint = response.status === 404
          ? 'Proxy endpoint not available. Run `npm run dev` to enable it.'
          : '';
        throw new Error(json?.error || hint || `Proxy failed (${response.status})`);
      }

      setProxyHeaders(normalizeHeaders(json.headers));
    } catch (err) {
      setError(err?.message || 'Unable to fetch headers.');
    }
  };

  const analysis = useMemo(() => {
    const headers = useProxy ? proxyHeaders : parseHeaderText(headerText);
    if (!headers || Object.keys(headers).length === 0) {
      return null;
    }
    return analyzeCors(headers);
  }, [headerText, proxyHeaders, useProxy]);

  const output = analysis ? JSON.stringify({
    source: useProxy ? 'proxy' : 'manual',
    url: useProxy ? url : undefined,
    analysis,
  }, null, 2) : '';

  return (
    <ToolShell
      title="CORS Header Analyzer"
      description="Analyze response headers for CORS configuration issues."
      controls={
        <>
          <label className="inline-flex items-center gap-2 text-xs ui-muted">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(event) => setUseProxy(event.target.checked)}
            />
            Use dev proxy
          </label>
          <button type="button" className="ui-btn" onClick={analyze}>
            Analyze
          </button>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="field-input"
            placeholder="https://example.com"
          />
          <TextPanel
            label="Paste response headers (optional)"
            value={headerText}
            onChange={setHeaderText}
            placeholder="Access-Control-Allow-Origin: *"
            className="h-44"
          />
          {error ? <span className="text-xs text-red-700">{error}</span> : null}
          {useProxy ? (
            <span className="ui-muted text-xs">
              Proxy is dev-only and runs on localhost.
            </span>
          ) : null}
        </div>
      }
      output={
        output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Run analysis to see results.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
