import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';

export default function UrlConverterTool() {
  const [input, setInput] = useState('https://example.com/search?q=dev tools&sort=asc');
  const [mode, setMode] = useState('encode');

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: '', error: '' };
    }

    try {
      const result = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
      return { output: result, error: '' };
    } catch (e) {
      return { output: '', error: e.message };
    }
  }, [input, mode]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Convert strings to URL-safe format and decode them back instantly."
      controls={
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      }
      input={<TextPanel label="Input" value={input} onChange={setInput} placeholder="Paste URL or text" />}
      output={
        <OutputPanel title="Output" output={output} onCopy={copyOutput} copyDisabled={!output}>
          {error ? <span className="text-red-700">{error}</span> : output || 'Converted value appears here'}
        </OutputPanel>
      }
    />
  );
}
