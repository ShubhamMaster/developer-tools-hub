import { useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { decodeBase64Url } from '../../utils/stringUtils.js';
import { bufferToBase64Url, textToBytes } from '../../utils/cryptoUtils.js';

function parseJsonSegment(segment, label) {
  try {
    return { ok: true, data: JSON.parse(decodeBase64Url(segment)) };
  } catch (error) {
    return { ok: false, error: `${label} decode failed: ${error.message}` };
  }
}

export default function JwtValidatorTool() {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const validateToken = async () => {
    setError('');
    setOutput('');

    if (!token.trim()) {
      setError('Paste a JWT token to validate.');
      return;
    }

    if (!secret.trim()) {
      setError('Secret is required to verify HS256 tokens.');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setError('JWT must have 3 segments.');
      return;
    }

    const headerResult = parseJsonSegment(parts[0], 'Header');
    if (!headerResult.ok) {
      setError(headerResult.error);
      return;
    }

    const payloadResult = parseJsonSegment(parts[1], 'Payload');
    if (!payloadResult.ok) {
      setError(payloadResult.error);
      return;
    }

    const header = headerResult.data;
    const payload = payloadResult.data;

    if (header.alg !== 'HS256') {
      setError('Only HS256 is supported in this validator.');
      return;
    }

    if (!window.crypto?.subtle) {
      setError('WebCrypto is not available in this browser.');
      return;
    }

    try {
      const key = await window.crypto.subtle.importKey(
        'raw',
        textToBytes(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
      );
      const signature = await window.crypto.subtle.sign(
        'HMAC',
        key,
        textToBytes(`${parts[0]}.${parts[1]}`),
      );

      const expectedSignature = bufferToBase64Url(signature);
      const signatureMatches = expectedSignature === parts[2];

      const now = Math.floor(Date.now() / 1000);
      const exp = typeof payload.exp === 'number' ? payload.exp : null;
      const nbf = typeof payload.nbf === 'number' ? payload.nbf : null;
      const iat = typeof payload.iat === 'number' ? payload.iat : null;

      const expStatus = exp ? (now <= exp ? 'valid' : 'expired') : 'missing';
      const nbfStatus = nbf ? (now >= nbf ? 'active' : 'notActive') : 'missing';

      const isValid = signatureMatches && (expStatus !== 'expired') && (nbfStatus !== 'notActive');

      const result = {
        valid: isValid,
        signatureMatches,
        time: {
          now,
          exp,
          nbf,
          iat,
          expStatus,
          nbfStatus,
        },
        header,
        payload,
      };

      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err?.message || 'Unable to validate token.');
    }
  };

  return (
    <ToolShell
      title="JWT Validator"
      description="Validate HS256 signature and time-based claims."
      controls={
        <button type="button" className="ui-btn-primary" onClick={validateToken}>
          Validate
        </button>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <TextPanel label="JWT Token" value={token} onChange={setToken} />
          <input
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="field-input"
            placeholder="HMAC secret"
          />
        </div>
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Run validation to see results.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
