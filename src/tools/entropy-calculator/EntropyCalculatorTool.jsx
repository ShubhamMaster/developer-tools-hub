import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

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
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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

  const analysis = useMemo(() => analyzeEntropy(input), [input]);
  const output = analysis ? JSON.stringify(analysis, null, 2) : '';

  return (
    <ToolShell
      title="Entropy Calculator"
      description="Estimate Shannon entropy and character distribution for text."
      input={<TextPanel label="Input" value={input} onChange={setInput} />}
      output={
        analysis ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Enter text to calculate entropy.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
