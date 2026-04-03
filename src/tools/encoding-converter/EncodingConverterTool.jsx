import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { textToBytes, bytesToText } from '../../utils/cryptoUtils.js';

const MODES = [
  { label: 'Text to Binary', value: 'text-binary' },
  { label: 'Binary to Text', value: 'binary-text' },
  { label: 'Text to Hex', value: 'text-hex' },
  { label: 'Hex to Text', value: 'hex-text' },
  { label: 'Text to Unicode', value: 'text-unicode' },
  { label: 'Unicode to Text', value: 'unicode-text' },
];

function bytesToBinary(bytes) {
  return Array.from(bytes, (byte) => byte.toString(2).padStart(8, '0')).join(' ');
}

function binaryToBytes(value) {
  const cleaned = value.replace(/[^01]/g, '');
  if (!cleaned || cleaned.length % 8 !== 0) {
    throw new Error('Binary input must be a multiple of 8 bits.');
  }

  const bytes = new Uint8Array(cleaned.length / 8);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(cleaned.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(' ');
}

function hexToBytes(value) {
  const cleaned = value.replace(/[^0-9a-fA-F]/g, '');
  if (!cleaned || cleaned.length % 2 !== 0) {
    throw new Error('Hex input must have an even number of digits.');
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function textToUnicode(value) {
  return Array.from(value)
    .map((char) => `U+${char.codePointAt(0).toString(16).toUpperCase()}`)
    .join(' ');
}

function unicodeToText(value) {
  const matches = value.match(/[0-9a-fA-F]{2,6}/g);
  if (!matches) {
    throw new Error('No Unicode code points found.');
  }

  return matches
    .map((token) => String.fromCodePoint(Number.parseInt(token, 16)))
    .join('');
}

export default function EncodingConverterTool() {
  const [mode, setMode] = useState('text-binary');
  const [input, setInput] = useState('Hello');

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }

    try {
      switch (mode) {
        case 'text-binary':
          return { output: bytesToBinary(textToBytes(input)), error: '' };
        case 'binary-text':
          return { output: bytesToText(binaryToBytes(input)), error: '' };
        case 'text-hex':
          return { output: bytesToHex(textToBytes(input)), error: '' };
        case 'hex-text':
          return { output: bytesToText(hexToBytes(input)), error: '' };
        case 'text-unicode':
          return { output: textToUnicode(input), error: '' };
        case 'unicode-text':
          return { output: unicodeToText(input), error: '' };
        default:
          return { output: '', error: '' };
      }
    } catch (err) {
      return { output: '', error: err?.message || 'Conversion failed.' };
    }
  }, [input, mode]);

  return (
    <ToolShell
      title="Binary / Hex / Unicode Converter"
      description="Convert text between binary, hex, and Unicode representations."
      controls={
        <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
          {MODES.map((entry) => (
            <option key={entry.value} value={entry.value}>
              {entry.label}
            </option>
          ))}
        </select>
      }
      input={<TextPanel label="Input" value={input} onChange={setInput} />}
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
