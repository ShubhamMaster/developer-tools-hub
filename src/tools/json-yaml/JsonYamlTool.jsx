import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

export default function JsonYamlTool() {
  const [mode, setMode] = useState('json-to-yaml');
  const [input, setInput] = useState(`{
  "name": "Developer Tools Hub",
  "version": 1
}`);

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }

    try {
      if (mode === 'json-to-yaml') {
        const data = JSON.parse(input);
        return { output: yaml.dump(data), error: '' };
      }

      const data = yaml.load(input);
      return { output: JSON.stringify(data, null, 2), error: '' };
    } catch (err) {
      return { output: '', error: err?.message || 'Conversion failed.' };
    }
  }, [input, mode]);

  return (
    <ToolShell
      title="JSON/YAML Converter"
      description="Convert between JSON and YAML formats."
      controls={
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
          <option value="json-to-yaml">JSON to YAML</option>
          <option value="yaml-to-json">YAML to JSON</option>
        </select>
      }
      input={
        <TextPanel
          label={mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
          value={input}
          onChange={setInput}
        />
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Output appears here.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
