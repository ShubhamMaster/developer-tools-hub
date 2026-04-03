import { useMemo, useState } from 'react';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: false,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
});

export default function JsonXmlTool() {
  const [mode, setMode] = useState('json-to-xml');
  const [input, setInput] = useState(`{
  "root": {
    "message": "Hello"
  }
}`);

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }

    try {
      if (mode === 'json-to-xml') {
        const data = JSON.parse(input);
        return { output: builder.build(data), error: '' };
      }

      const data = parser.parse(input);
      return { output: JSON.stringify(data, null, 2), error: '' };
    } catch (err) {
      return { output: '', error: err?.message || 'Conversion failed.' };
    }
  }, [input, mode]);

  return (
    <ToolShell
      title="JSON/XML Converter"
      description="Convert between JSON and XML formats."
      controls={
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
          <option value="json-to-xml">JSON to XML</option>
          <option value="xml-to-json">XML to JSON</option>
        </select>
      }
      input={
        <TextPanel
          label={mode === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
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
