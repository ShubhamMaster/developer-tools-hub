import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { copyTextToClipboard } from '../../utils/clipboard.js';

function splitWords(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim()
    .split(/\s+|_|-/)
    .filter(Boolean);
}

function toTitle(words) {
  return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

export default function CaseConverterTool() {
  const [input, setInput] = useState('developer tools hub');

  const output = useMemo(() => {
    const words = splitWords(input);
    if (!words.length) {
      return '';
    }

    const pascal = words.map((word) => word[0].toUpperCase() + word.slice(1)).join('');
    const camel = words[0] + words.slice(1).map((word) => word[0].toUpperCase() + word.slice(1)).join('');

    return JSON.stringify(
      {
        lower: words.join(' '),
        upper: words.join(' ').toUpperCase(),
        title: toTitle(words),
        camel,
        pascal,
        snake: words.join('_'),
        kebab: words.join('-'),
      },
      null,
      2,
    );
  }, [input]);

  const copyOutput = async () => {
    if (!output) return false;
    return copyTextToClipboard(output);
  };

  return (
    <ToolShell
      title="Case Converter"
      description="Convert text into common programming and display casing styles."
      input={<TextPanel label="Input Text" value={input} onChange={setInput} placeholder="Type any phrase" />}
      output={<OutputPanel title="Converted Cases" output={output} onCopy={copyOutput} copyDisabled={!output} />}
    />
  );
}
