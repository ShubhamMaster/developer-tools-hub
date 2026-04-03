import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { decodeBase64Url } from '../../utils/stringUtils.js';

function parsePayload(token) {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Token must contain at least two segments.');
  }
  return JSON.parse(decodeBase64Url(parts[1]));
}

function formatUnix(value) {
  if (typeof value !== 'number') return null;
  return new Date(value * 1000).toISOString();
}

export default function JwtClaimsTool() {
  const [token, setToken] = useState('');

  const analysis = useMemo(() => {
    if (!token.trim()) {
      return null;
    }

    try {
      const payload = parsePayload(token.trim());
      const now = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === 'number' ? payload.exp : null;
      const nbf = typeof payload.nbf === 'number' ? payload.nbf : null;
      const iat = typeof payload.iat === 'number' ? payload.iat : null;

      return {
        now,
        exp,
        nbf,
        iat,
        expIso: formatUnix(exp),
        nbfIso: formatUnix(nbf),
        iatIso: formatUnix(iat),
        isExpired: exp ? now > exp : null,
        isActive: nbf ? now >= nbf : null,
        payload,
      };
    } catch (error) {
      return { error: error.message };
    }
  }, [token]);

  const output = analysis ? JSON.stringify(analysis, null, 2) : '';

  return (
    <ToolShell
      title="JWT Claims Analyzer"
      description="Inspect exp/nbf/iat claims and token timing status."
      input={<TextPanel label="JWT Token" value={token} onChange={setToken} />}
      output={
        !analysis ? (
          <span className="ui-muted">Paste a token to inspect claims.</span>
        ) : analysis.error ? (
          <span className="text-red-700">{analysis.error}</span>
        ) : (
          <CodeBlock text={output} />
        )
      }
      outputCopyText={analysis?.error ? '' : output}
      outputCopyDisabled={!analysis || Boolean(analysis?.error)}
    />
  );
}
