import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';

const SCORE_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

function countUniqueChars(value) {
  return new Set(value.split('')).size;
}

function estimateEntropy(password, poolSize) {
  if (!password || !poolSize) return 0;
  return Math.round(password.length * Math.log2(poolSize));
}

export default function PasswordStrengthTool() {
  const [password, setPassword] = useState('');

  const analysis = useMemo(() => {
    if (!password) {
      return null;
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    let pool = 0;
    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 32;

    const entropy = estimateEntropy(password, pool || 1);
    const uniqueChars = countUniqueChars(password);

    let score = 0;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if ([hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length >= 3) score += 1;
    if (entropy >= 60) score += 1;
    if (uniqueChars >= Math.min(10, password.length)) score += 1;
    score = Math.min(score, SCORE_LABELS.length - 1);

    const tips = [];
    if (password.length < 12) tips.push('Increase length to 12+ characters.');
    if (!hasUpper) tips.push('Add uppercase letters.');
    if (!hasLower) tips.push('Add lowercase letters.');
    if (!hasNumber) tips.push('Include numbers.');
    if (!hasSymbol) tips.push('Include symbols.');
    if (uniqueChars < password.length * 0.6) tips.push('Avoid repeated patterns.');

    return {
      score,
      label: SCORE_LABELS[score],
      entropyBits: entropy,
      length: password.length,
      uniqueChars,
      characterSets: {
        lower: hasLower,
        upper: hasUpper,
        number: hasNumber,
        symbol: hasSymbol,
      },
      tips: tips.length ? tips : ['Looks good. Consider a password manager for best results.'],
    };
  }, [password]);

  return (
    <ToolShell
      title="Password Strength Analyzer"
      description="Estimate strength, entropy, and improvement tips for passwords."
      input={
        <TextPanel
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Type a password"
        />
      }
      output={
        !analysis ? (
          <span className="ui-muted">Enter a password to analyze.</span>
        ) : (
          <CodeBlock text={JSON.stringify(analysis, null, 2)} />
        )
      }
      outputCopyText={analysis ? JSON.stringify(analysis, null, 2) : ''}
      outputCopyDisabled={!analysis}
    />
  );
}
