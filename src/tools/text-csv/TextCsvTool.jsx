import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { downloadTextFile } from '../../utils/download.js';

function escapeCsvCell(value, delimiter) {
  const raw = String(value ?? '');
  const needsQuotes = raw.includes('"') || raw.includes('\n') || raw.includes('\r') || raw.includes(delimiter);
  if (!needsQuotes) {
    return raw;
  }

  return `"${raw.replaceAll('"', '""')}"`;
}

function textToCsv(text, delimiter) {
  const lines = String(text ?? '').replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');
  return lines.map((line) => escapeCsvCell(line, delimiter)).join(`\n`);
}

function csvToText(csv, delimiter) {
  // Minimal conversion: replace delimiter with tabs while preserving lines.
  // This avoids heavy parsing libraries and still makes CSV readable as text.
  const normalized = String(csv ?? '').replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  const tabbed = delimiter === '\t' ? normalized : normalized.replaceAll(delimiter, '\t');
  return tabbed;
}

export default function TextCsvTool() {
  const [mode, setMode] = useState('text-to-csv');
  const [delimiter, setDelimiter] = useState(',');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) {
      return '';
    }

    if (mode === 'csv-to-text') {
      return csvToText(input, delimiter);
    }

    return textToCsv(input, delimiter);
  }, [delimiter, input, mode]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    if (!output) {
      return;
    }

    const isCsv = mode === 'text-to-csv';
    downloadTextFile({
      content: output,
      filename: isCsv ? 'output.csv' : 'output.txt',
      mime: isCsv ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
    });
  };

  const importFile = async (event) => {
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
      <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
        <option value="text-to-csv">Text → CSV</option>
        <option value="csv-to-text">CSV → Text</option>
      </select>
      <select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="ui-select">
        <option value=",">Comma</option>
        <option value=";">Semicolon</option>
        <option value="\t">Tab</option>
      </select>
      <label className="ui-btn cursor-pointer">
        <input
          type="file"
          accept="text/plain,text/csv,.txt,.csv"
          onChange={importFile}
          className="hidden"
        />
        Import
      </label>
      <button type="button" className="ui-btn" onClick={downloadOutput} disabled={!output}>
        Export
      </button>
      <button type="button" className="ui-btn" onClick={() => setInput('')}>
        Clear
      </button>
    </>
  );

  return (
    <ToolShell
      title="Text ↔ CSV"
      description="Import a .txt/.csv file and convert between plain text and CSV." 
      controls={controls}
      input={<TextPanel label="Input" value={input} onChange={setInput} placeholder="Paste text or CSV..." />}
      output={
        <OutputPanel
          title="Output"
          output={output}
          onCopy={copyOutput}
          copyDisabled={!output}
          meta={output ? `${output.length.toLocaleString()} chars` : undefined}
        />
      }
    />
  );
}
