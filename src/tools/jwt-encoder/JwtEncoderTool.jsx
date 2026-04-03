import { useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { safeJsonParse } from '../../utils/formatters.js';
import { bufferToBase64Url, textToBytes, textToBase64Url } from '../../utils/cryptoUtils.js';

const DEFAULT_HEADER = '{"alg":"HS256","typ":"JWT"}';
const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub: 'user-123',
    role: 'member',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  null,
  2,
);

export default function JwtEncoderTool() {
  const [headerJson, setHeaderJson] = useState(DEFAULT_HEADER);
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generateToken = async () => {
    setError('');
    setOutput('');

    if (!secret.trim()) {
      setError('Secret is required to sign HS256 tokens.');
      return;
    }

    const headerResult = safeJsonParse(headerJson);
    const payloadResult = safeJsonParse(payloadJson);

    if (!headerResult.ok) {
      setError(`Header JSON error: ${headerResult.error}`);
      return;
    }

    if (!payloadResult.ok) {
      setError(`Payload JSON error: ${payloadResult.error}`);
      return;
    }

    const header = headerResult.data;
    if (header.alg && header.alg !== 'HS256') {
      setError('Only HS256 is supported in this tool.');
      return;
    }

    if (!window.crypto?.subtle) {
      setError('WebCrypto is not available in this browser.');
      return;
    }

    const encodedHeader = textToBase64Url(JSON.stringify({ ...header, alg: 'HS256' }));
    const encodedPayload = textToBase64Url(JSON.stringify(payloadResult.data));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

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
        textToBytes(signingInput),
      );

      const encodedSignature = bufferToBase64Url(signature);
      setOutput(`${signingInput}.${encodedSignature}`);
    } catch (err) {
      setError(err?.message || 'Unable to generate token.');
    }
  };

  return (
    <ToolShell
      title="JWT Encoder"
      description="Create HS256 JWT tokens from JSON header and payload data."
      controls={
        <button type="button" className="ui-btn-primary" onClick={generateToken}>
          Generate
        </button>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <TextPanel label="Header" value={headerJson} onChange={setHeaderJson} />
          <TextPanel label="Payload" value={payloadJson} onChange={setPayloadJson} />
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
          <span className="ui-muted">Generate a token to see output.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
