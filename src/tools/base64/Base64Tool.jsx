import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { safeBase64Decode, safeBase64Encode } from '../../utils/stringUtils.js';

export default function Base64Tool() {
  const [input, setInput] = useState('hello world');
  const [mode, setMode] = useState('encode');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      return mode === 'encode'
        ? { output: safeBase64Encode(input), error: '' }
        : { output: safeBase64Decode(input), error: '' };
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
      title="Base64 Encoder / Decoder"
      description="String-first Base64 conversion with UTF-8 safety."
      controls={
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value)}
          className="ui-select"
        >
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      }
      input={<TextPanel label="Input" value={input} onChange={setInput} placeholder="Type plain text or Base64" />}
      output={
        <OutputPanel title="Output" output={output} onCopy={copyOutput} copyDisabled={!output}>
          {error ? <span className="text-red-700">{error}</span> : output || 'Output appears here'}
        </OutputPanel>
      }
    />
  );
}
