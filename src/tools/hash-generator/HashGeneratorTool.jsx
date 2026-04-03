import { useEffect, useMemo, useState } from 'react';
import SparkMD5 from 'spark-md5';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const HASH_ALGOS = [
  { label: 'MD5', value: 'MD5' },
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
];

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function getEntropyLabel(bits) {
  if (bits >= 120) return 'Extremely strong';
  if (bits >= 90) return 'Very strong';
  if (bits >= 60) return 'Strong';
  if (bits >= 36) return 'Moderate';
  return 'Weak';
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState('Developer Tools Hub');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [useHmac, setUseHmac] = useState(false);
  const [hmacKey, setHmacKey] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const debouncedInput = useDebouncedValue(input, 200);
  const debouncedKey = useDebouncedValue(hmacKey, 200);

  const canHmac = algorithm !== 'MD5';

  useEffect(() => {
    let isActive = true;

    const run = async () => {
      setError('');
      setOutput('');

      if (!debouncedInput) {
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(debouncedInput);

      try {
        if (algorithm === 'MD5') {
          if (useHmac) {
            throw new Error('HMAC is not available for MD5 in this tool.');
          }

          const slice = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          const md5Hex = SparkMD5.ArrayBuffer.hash(slice);
          const outputPayload = {
            algorithm: 'MD5',
            hex: md5Hex,
          };
          if (isActive) {
            setOutput(JSON.stringify(outputPayload, null, 2));
          }
          return;
        }

        let digestBuffer;
        if (useHmac) {
          if (!debouncedKey) {
            throw new Error('Enter an HMAC key to sign with.');
          }

          const keyData = encoder.encode(debouncedKey);
          const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: { name: algorithm } },
            false,
            ['sign'],
          );
          digestBuffer = await crypto.subtle.sign('HMAC', key, data);
        } else {
          digestBuffer = await crypto.subtle.digest(algorithm, data);
        }

        const outputPayload = {
          algorithm: useHmac ? `${algorithm} (HMAC)` : algorithm,
          hex: bufferToHex(digestBuffer),
          base64: bufferToBase64(digestBuffer),
        };

        if (isActive) {
          setOutput(JSON.stringify(outputPayload, null, 2));
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || 'Unable to generate hash.');
        }
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [algorithm, debouncedInput, debouncedKey, useHmac]);

  const meta = useMemo(() => {
    if (!debouncedInput) {
      return 'Enter data to hash.';
    }

    const chars = debouncedInput.length;
    const bits = chars * 8;
    return `${chars} chars • ${bits} bits input`; 
  }, [debouncedInput]);

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate message digests and HMAC signatures for common algorithms."
      controls={
        <>
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value)}
            className="ui-select"
          >
            {HASH_ALGOS.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-xs ui-muted">
            <input
              type="checkbox"
              checked={useHmac}
              onChange={(event) => setUseHmac(event.target.checked)}
              disabled={!canHmac}
            />
            Use HMAC
          </label>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          <TextPanel
            label="Input"
            value={input}
            onChange={setInput}
            placeholder="Paste text to hash"
          />
          {useHmac ? (
            <input
              value={hmacKey}
              onChange={(event) => setHmacKey(event.target.value)}
              className="field-input"
              placeholder="HMAC key"
            />
          ) : null}
        </div>
      }
      outputMeta={meta}
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Output appears here</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
