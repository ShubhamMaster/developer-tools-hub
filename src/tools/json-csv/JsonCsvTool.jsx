import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

const DELIMITERS = [
  { label: 'Comma', value: ',' },
  { label: 'Semicolon', value: ';' },
  { label: 'Tab', value: '\t' },
];

export default function JsonCsvTool() {
  const [mode, setMode] = useState('json-to-csv');
  const [delimiter, setDelimiter] = useState(',');
  const [input, setInput] = useState(`[
  { "name": "Alpha", "score": 10 },
  { "name": "Beta", "score": 12 }
]`);

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }

    try {
      if (mode === 'json-to-csv') {
        const data = JSON.parse(input);
        const rows = Array.isArray(data) ? data : [data];
        return { output: Papa.unparse(rows, { delimiter }), error: '' };
      }

      const parsed = Papa.parse(input, {
        header: true,
        skipEmptyLines: true,
        delimiter,
      });

      if (parsed.errors && parsed.errors.length) {
        return { output: '', error: parsed.errors[0].message };
      }

      return { output: JSON.stringify(parsed.data, null, 2), error: '' };
    } catch (err) {
      return { output: '', error: err?.message || 'Conversion failed.' };
    }
  }, [delimiter, input, mode]);

  return (
    <ToolShell
      title="JSON/CSV Converter"
      description="Convert between JSON arrays and CSV rows."
      controls={
        <>
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
            <option value="json-to-csv">JSON to CSV</option>
            <option value="csv-to-json">CSV to JSON</option>
          </select>
          <select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="ui-select">
            {DELIMITERS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
        </>
      }
      input={
        <TextPanel
          label={mode === 'json-to-csv' ? 'JSON Input' : 'CSV Input'}
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
