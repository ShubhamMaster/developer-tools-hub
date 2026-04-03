import { useState } from 'react';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { bufferToBase64 } from '../../utils/cryptoUtils.js';

const KEY_SIZES = [2048, 3072, 4096];

function wrapPem(base64, label) {
  const lines = base64.match(/.{1,64}/g)?.join('\n') || base64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

export default function RsaKeygenTool() {
  const [modulusLength, setModulusLength] = useState(2048);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    setOutput('');

    if (!window.crypto?.subtle) {
      setError('WebCrypto is not available in this browser.');
      return;
    }

    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt'],
      );

      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

      const publicPem = wrapPem(bufferToBase64(publicKey), 'PUBLIC KEY');
      const privatePem = wrapPem(bufferToBase64(privateKey), 'PRIVATE KEY');

      const payload = {
        algorithm: 'RSA-OAEP',
        modulusLength,
        publicKeyPem: publicPem,
        privateKeyPem: privatePem,
      };

      setOutput(JSON.stringify(payload, null, 2));
    } catch (err) {
      setError(err?.message || 'Failed to generate RSA keys.');
    }
  };

  return (
    <ToolShell
      title="RSA Key Generator"
      description="Generate RSA-OAEP key pairs and export PEM strings locally."
      controls={
        <>
          <select
            value={modulusLength}
            onChange={(event) => setModulusLength(Number(event.target.value))}
            className="ui-select"
          >
            {KEY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}-bit
              </option>
            ))}
          </select>
          <button type="button" className="ui-btn-primary" onClick={generate}>
            Generate Keys
          </button>
        </>
      }
      input={
        <div className="ui-surface p-4 text-sm ui-muted">
          Generates an RSA-OAEP keypair in your browser. Private keys never leave your device.
        </div>
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Generate keys to see output.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
