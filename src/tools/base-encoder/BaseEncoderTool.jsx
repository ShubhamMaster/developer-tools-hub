import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
import { bytesToText, textToBytes } from '../../utils/cryptoUtils.js';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base32Encode(bytes) {
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(text) {
  const cleaned = text.toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const output = [];

  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error('Invalid Base32 character.');
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

function base58Encode(bytes) {
  if (!bytes.length) return '';

  const digits = [0];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i += 1) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = Math.floor(carry / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }

  let prefix = '';
  for (const byte of bytes) {
    if (byte === 0) prefix += '1';
    else break;
  }

  return prefix + digits.reverse().map((d) => BASE58_ALPHABET[d]).join('');
}

function base58Decode(text) {
  if (!text) return new Uint8Array();

  const bytes = [0];
  for (const char of text) {
    const index = BASE58_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error('Invalid Base58 character.');
    }

    let carry = index;
    for (let i = 0; i < bytes.length; i += 1) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 255;
      carry >>= 8;
    }

    while (carry > 0) {
      bytes.push(carry & 255);
      carry >>= 8;
    }
  }

  let leadingZeros = 0;
  for (const char of text) {
    if (char === '1') leadingZeros += 1;
    else break;
  }

  const output = new Uint8Array(leadingZeros + bytes.length);
  output.set(bytes.reverse(), leadingZeros);
  return output;
}

export default function BaseEncoderTool() {
  const [mode, setMode] = useState('encode');
  const [encoding, setEncoding] = useState('base32');
  const [input, setInput] = useState('Developer Tools Hub');

  const { output, error } = useMemo(() => {
    if (!input) {
      return { output: '', error: '' };
    }

    try {
      if (encoding === 'base32') {
        return {
          output: mode === 'encode'
            ? base32Encode(textToBytes(input))
            : bytesToText(base32Decode(input)),
          error: '',
        };
      }

      return {
        output: mode === 'encode'
          ? base58Encode(textToBytes(input))
          : bytesToText(base58Decode(input)),
        error: '',
      };
    } catch (err) {
      return { output: '', error: err?.message || 'Unable to convert input.' };
    }
  }, [encoding, input, mode]);

  return (
    <ToolShell
      title="Base32 / Base58 Encoder"
      description="Convert between text and Base32/Base58 encodings."
      controls={
        <>
          <select value={encoding} onChange={(event) => setEncoding(event.target.value)} className="ui-select">
            <option value="base32">Base32</option>
            <option value="base58">Base58</option>
          </select>
          <select value={mode} onChange={(event) => setMode(event.target.value)} className="ui-select">
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </>
      }
      input={<TextPanel label="Input" value={input} onChange={setInput} />}
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : output ? (
          <CodeBlock text={output} />
        ) : (
          <span className="ui-muted">Output appears here.</span>
        )
      }
      outputCopyText={output}
      outputCopyDisabled={!output}
    />
  );
}
