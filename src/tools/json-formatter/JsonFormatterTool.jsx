import { useEffect, useMemo, useRef, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { downloadTextFile } from '../../utils/download.js';
import { copyTextToClipboard } from '../../utils/clipboard.js';

const SAMPLE = '{"name":"Developer Tools Hub","version":1,"enabled":true}';

export default function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState('format');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const workerRef = useRef(null);

  const debouncedInput = useDebouncedValue(input, 160);
  const debouncedMode = useDebouncedValue(mode, 40);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./jsonWorker.js', import.meta.url), { type: 'module' });
    const worker = workerRef.current;

    worker.onmessage = (event) => {
      if (event.data.ok) {
        setError('');
        setOutput(event.data.output);
      } else {
        setOutput('');
        setError(event.data.error || 'Invalid JSON');
      }
    };

    return () => worker.terminate();
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage({ text: debouncedInput, mode: debouncedMode });
  }, [debouncedInput, debouncedMode]);

  const meta = useMemo(() => {
    const chars = input.length.toLocaleString();
    return `${chars} chars`; 
  }, [input]);

  const copyOutput = async () => {
    if (!output) return false;
    return copyTextToClipboard(output);
  };

  const exportJson = () => {
    if (!output || error) {
      return;
    }

    downloadTextFile({
      content: output,
      filename: 'output.json',
      mime: 'application/json;charset=utf-8',
    });
  };

  const importJsonFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setInput(text);
    event.target.value = '';
  };

  const controls = (
    <>
      <select
        value={mode}
        onChange={(event) => setMode(event.target.value)}
        className="ui-select"
      >
        <option value="format">Format</option>
        <option value="minify">Minify</option>
        <option value="validate">Validate</option>
      </select>
      <label className="ui-btn cursor-pointer">
        <input
          type="file"
          accept="application/json,text/plain,.json"
          onChange={importJsonFile}
          className="hidden"
        />
        Import
      </label>
      <button
        type="button"
        onClick={exportJson}
        className="ui-btn"
        disabled={!output || Boolean(error)}
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={() => setInput('')}
        className="ui-btn"
      >
        Clear
      </button>
    </>
  );

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, minify, and validate JSON with worker-based parsing."
      controls={controls}
      input={
        <TextPanel
          label="Input JSON"
          value={input}
          onChange={setInput}
          placeholder="Paste JSON..."
        />
      }
      output={
        <OutputPanel title="Output" output={output} onCopy={copyOutput} meta={meta} copyDisabled={!output}>
          {error ? <span className="text-red-700">{error}</span> : output ? <CodeBlock text={output} /> : 'Output appears here'}
        </OutputPanel>
      }
    />
  );
}
