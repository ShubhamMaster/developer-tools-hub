import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

function encodeHtml(value) {
  if (typeof document === 'undefined') {
    return value;
  }
  const textarea = document.createElement('textarea');
  textarea.textContent = value;
  return textarea.innerHTML;
}

function decodeHtml(value) {
  if (typeof document === 'undefined') {
    return value;
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

export default function HtmlEntityTool() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('<div>Hello & Welcome</div>');

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'encode' ? encodeHtml(input) : decodeHtml(input);
  }, [input, mode]);

  return (
    <ToolShell
      title="HTML Entity Encoder"
      description="Encode or decode HTML entities safely in the browser."
      controls={
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      }
      input={<TextPanel label="Input" value={input} onChange={setInput} />}
      output={output ? <CodeBlock text={output} /> : <span className="ui-muted">Output appears here.</span>}
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
