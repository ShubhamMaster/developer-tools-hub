import { useMemo, useState } from 'react';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';

const BASES = [
  { label: 'Binary (2)', value: 2 },
  { label: 'Octal (8)', value: 8 },
  { label: 'Decimal (10)', value: 10 },
  { label: 'Hex (16)', value: 16 },
];

export default function NumberBaseConverterTool() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);

  const { output, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: '' };
    }

    const normalized = input.trim();
    const decimal = Number.parseInt(normalized, fromBase);

    if (Number.isNaN(decimal)) {
      return { output: '', error: `Invalid base-${fromBase} number.` };
    }

    return {
      output: JSON.stringify(
        {
          binary: decimal.toString(2),
          octal: decimal.toString(8),
          decimal: decimal.toString(10),
          hex: decimal.toString(16).toUpperCase(),
        },
        null,
        2,
      ),
      error: '',
    };
  }, [input, fromBase]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      title="Number Base Converter"
      description="Translate values between binary, octal, decimal, and hexadecimal."
      controls={
        <select value={fromBase} onChange={(event) => setFromBase(Number(event.target.value))} className="ui-select">
          {BASES.map((base) => (
            <option key={base.value} value={base.value}>
              {base.label}
            </option>
          ))}
        </select>
      }
      input={
        <label className="flex h-full flex-col gap-2">
          <span className="ui-label">Input Value</span>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="code-input"
            placeholder="Enter number"
          />
        </label>
      }
      output={
        <OutputPanel title="Converted" output={output} onCopy={copyOutput} copyDisabled={!output}>
          {error ? <span className="text-red-700">{error}</span> : output || 'Converted values appear here'}
        </OutputPanel>
      }
    />
  );
}
