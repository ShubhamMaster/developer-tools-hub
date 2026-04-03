import { useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { base64ToBytes, bufferToBase64, bytesToBase64, textToBytes, bytesToText } from '../../utils/cryptoUtils.js';

const KEY_SIZES = [
  { label: '128-bit', value: 128 },
  { label: '256-bit', value: 256 },
];

export default function AesGcmTool() {
  const [mode, setMode] = useState('encrypt');
  const [keySize, setKeySize] = useState(256);
  const [input, setInput] = useState('Hello secure world');
  const [keyBase64, setKeyBase64] = useState('');
  const [ivBase64, setIvBase64] = useState('');
  const [aad, setAad] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generateKey = () => {
    if (!window.crypto?.getRandomValues) {
      setError('Secure random generator not available.');
      return;
    }

    const keyBytes = new Uint8Array(keySize / 8);
    const ivBytes = new Uint8Array(12);
    window.crypto.getRandomValues(keyBytes);
    window.crypto.getRandomValues(ivBytes);

    setKeyBase64(bytesToBase64(keyBytes));
    setIvBase64(bytesToBase64(ivBytes));
  };

  const run = async () => {
    setError('');
    setOutput('');

    if (!window.crypto?.subtle) {
      setError('WebCrypto is not available in this browser.');
      return;
    }

    if (!keyBase64.trim() || !ivBase64.trim()) {
      setError('Provide a Base64 key and IV (nonce).');
      return;
    }

    try {
      const keyBytes = base64ToBytes(keyBase64.trim());
      const ivBytes = base64ToBytes(ivBase64.trim());
      const algorithm = { name: 'AES-GCM', iv: ivBytes };

      if (aad.trim()) {
        algorithm.additionalData = textToBytes(aad.trim());
      }

      const key = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM', length: keyBytes.length * 8 },
        false,
        ['encrypt', 'decrypt'],
      );

      if (mode === 'encrypt') {
        const data = textToBytes(input);
        const encrypted = await window.crypto.subtle.encrypt(algorithm, key, data);
        const payload = {
          ciphertextBase64: bufferToBase64(encrypted),
          ivBase64,
        };
        setOutput(JSON.stringify(payload, null, 2));
      } else {
        const data = base64ToBytes(input.trim());
        const decrypted = await window.crypto.subtle.decrypt(algorithm, key, data);
        setOutput(bytesToText(new Uint8Array(decrypted)));
      }
    } catch (err) {
      setError(err?.message || 'AES operation failed.');
    }
  };

  return (
    <ToolShell
      title="AES-GCM Encrypt / Decrypt"
      description="Encrypt and decrypt text using AES-GCM with Base64 keys and IVs."
      controls={
        <>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="ui-select"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
          <select
            value={keySize}
            onChange={(event) => setKeySize(Number(event.target.value))}
            className="ui-select"
          >
            {KEY_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
          <button type="button" className="ui-btn" onClick={generateKey}>
            Generate Key/IV
          </button>
          <button type="button" className="ui-btn-primary" onClick={run}>
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <TextPanel
            label={mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}
            value={input}
            onChange={setInput}
          />
          <input
            value={keyBase64}
            onChange={(event) => setKeyBase64(event.target.value)}
            className="field-input"
            placeholder="Key (Base64)"
          />
          <input
            value={ivBase64}
            onChange={(event) => setIvBase64(event.target.value)}
            className="field-input"
            placeholder="IV / Nonce (Base64)"
          />
          <input
            value={aad}
            onChange={(event) => setAad(event.target.value)}
            className="field-input"
            placeholder="Additional authenticated data (optional)"
          />
        </div>
      }
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Run the operation to see results.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
