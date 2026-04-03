import { useEffect, useMemo, useState } from 'react';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import OverLimitNotice from '../../components/OverLimitNotice.jsx';

const PASSWORD_WARNING_LIMIT = 1024;

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?~',
};

function randomInt(max) {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildPool(options) {
  let pool = '';
  if (options.lower) pool += CHARSETS.lower;
  if (options.upper) pool += CHARSETS.upper;
  if (options.number) pool += CHARSETS.number;
  if (options.symbol) pool += CHARSETS.symbol;
  return pool;
}

function estimateEntropy(length, poolSize) {
  if (!length || !poolSize) return 0;
  return Math.round(length * Math.log2(poolSize));
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [number, setNumber] = useState(true);
  const [symbol, setSymbol] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [allowLargeLength, setAllowLargeLength] = useState(false);

  const parsedLength = Number(length);
  const normalizedLength = Number.isFinite(parsedLength) ? Math.max(0, Math.floor(parsedLength)) : 0;
  const overLimit = normalizedLength > PASSWORD_WARNING_LIMIT;
  const canGenerate = normalizedLength > 0 && (!overLimit || allowLargeLength);

  const pool = buildPool({ lower, upper, number, symbol });

  useEffect(() => {
    if (!overLimit && allowLargeLength) {
      setAllowLargeLength(false);
    }
  }, [allowLargeLength, overLimit]);

  const generate = () => {
    setError('');

    if (!pool) {
      setOutput('');
      setError('Select at least one character set.');
      return;
    }

    if (!canGenerate) {
      setOutput('');
      return;
    }

    const size = normalizedLength;
    const required = [];

    if (lower) required.push(CHARSETS.lower[randomInt(CHARSETS.lower.length)]);
    if (upper) required.push(CHARSETS.upper[randomInt(CHARSETS.upper.length)]);
    if (number) required.push(CHARSETS.number[randomInt(CHARSETS.number.length)]);
    if (symbol) required.push(CHARSETS.symbol[randomInt(CHARSETS.symbol.length)]);

    let chars = [];
    if (size > 0) {
      if (required.length > size) {
        chars = shuffle([...required]).slice(0, size);
      } else {
        const remaining = size - required.length;
        chars = [...required];
        for (let i = 0; i < remaining; i += 1) {
          chars.push(pool[randomInt(pool.length)]);
        }
      }
    }

    setOutput(chars.length ? shuffle(chars).join('') : '');
  };

  const meta = useMemo(() => {
    if (!output || !pool) return 'Ready to generate.';
    const entropy = estimateEntropy(output.length, pool.length);
    return `${output.length} chars • ${entropy} bits entropy`;
  }, [output, pool]);

  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong passwords with custom character sets."
      controls={
        <>
          <input
            type="number"
            value={length}
            onChange={(event) => setLength(event.target.value)}
            className="ui-select w-24"
          />
          <button
            type="button"
            onClick={generate}
            disabled={!canGenerate}
            className="ui-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate
          </button>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          {overLimit && !allowLargeLength ? (
            <OverLimitNotice
              message={`Large password length (${normalizedLength.toLocaleString()} chars). Generation may be slow or freeze your browser.`}
              actionLabel="Generate anyway"
              onAction={() => setAllowLargeLength(true)}
            />
          ) : null}
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lower} onChange={(event) => setLower(event.target.checked)} />
            Lowercase
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={upper} onChange={(event) => setUpper(event.target.checked)} />
            Uppercase
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={number} onChange={(event) => setNumber(event.target.checked)} />
            Numbers
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={symbol} onChange={(event) => setSymbol(event.target.checked)} />
            Symbols
          </label>
        </div>
      }
      outputMeta={meta}
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Generate a password to see output</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
