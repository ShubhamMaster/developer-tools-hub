import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { copyTextToClipboard } from '../../utils/clipboard.js';

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
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Idle');

  const canHaveBody = useMemo(() => method !== 'GET' && method !== 'DELETE', [method]);

  const runRequest = async () => {
    setStatus('Loading...');
    setOutput('');

    try {
      const response = await fetch(url, {
        method,
        headers: parseHeaders(headers),
        body: canHaveBody && body ? body : undefined,
      });

      const text = await response.text();
      setStatus(`${response.status} ${response.statusText}`);

      try {
        const json = JSON.parse(text);
        setOutput(JSON.stringify(json, null, 2));
      } catch {
        setOutput(text);
      }
    } catch (error) {
      setStatus('Request failed');
      setOutput(error.message);
    }
  };

  const copyOutput = async () => {
    if (!output) return false;
    return copyTextToClipboard(output);
  };

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
      output={<OutputPanel title="Response" output={output} onCopy={copyOutput} meta={status} copyDisabled={!output} />}
    />
  );
}
