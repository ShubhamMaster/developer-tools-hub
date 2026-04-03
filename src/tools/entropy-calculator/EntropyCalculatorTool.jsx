import { useEffect, useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import OverLimitNotice from '../../components/OverLimitNotice.jsx';

const ENTROPY_WARNING_LIMIT = 100000;

function analyzeEntropy(text) {
  if (!text) {
    return null;
  }

  const counts = new Map();
  for (const char of text) {
    counts.set(char, (counts.get(char) || 0) + 1);
  }

  const length = text.length;
  let entropy = 0;
  counts.forEach((count) => {
    const p = count / length;
    entropy -= p * Math.log2(p);
  });

  const topChars = Array.from(counts.entries())
    .map(([char, count]) => ({
      char,
      count,
      percent: Number(((count / length) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    length,
    uniqueChars: counts.size,
    entropyBitsPerChar: Number(entropy.toFixed(4)),
    totalEntropyBits: Number((entropy * length).toFixed(2)),
    topChars,
  };
}

export default function EntropyCalculatorTool() {
  const [input, setInput] = useState('Entropy test string');
  const [allowLargeAnalysis, setAllowLargeAnalysis] = useState(false);

  const overLimit = input.length > ENTROPY_WARNING_LIMIT;

  useEffect(() => {
    if (!overLimit && allowLargeAnalysis) {
      setAllowLargeAnalysis(false);
    }
  }, [allowLargeAnalysis, overLimit]);

  const analysis = useMemo(() => {
    if (overLimit && !allowLargeAnalysis) {
      return null;
    }
    return analyzeEntropy(input);
  }, [allowLargeAnalysis, input, overLimit]);
  const output = analysis ? JSON.stringify(analysis, null, 2) : '';
  const emptyMessage = overLimit && !allowLargeAnalysis
    ? 'Analysis paused for large input. Confirm to continue.'
    : 'Enter text to calculate entropy.';

  return (
    <ToolShell
      title="Entropy Calculator"
      description="Estimate Shannon entropy and character distribution for text."
      input={
        <div className="flex h-full flex-col gap-3">
          {overLimit && !allowLargeAnalysis ? (
            <OverLimitNotice
              message={`Large input (${input.length.toLocaleString()} chars). Entropy analysis may be slow or freeze your browser.`}
              actionLabel="Analyze anyway"
              onAction={() => setAllowLargeAnalysis(true)}
            />
          ) : null}
          <TextPanel label="Input" value={input} onChange={setInput} />
        </div>
      }
      output={
        analysis ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">{emptyMessage}</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
