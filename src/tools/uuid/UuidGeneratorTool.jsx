import { useEffect, useMemo, useState } from 'react';
import ToolShell from '../../components/ToolShell.jsx';
import { downloadTextFile } from '../../utils/download.js';
import CodeBlock from '../../components/CodeBlock.jsx';
import OverLimitNotice from '../../components/OverLimitNotice.jsx';

const UUID_WARNING_LIMIT = 5000;

function createUuidV4Fallback() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createUuid() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  if (globalThis.crypto?.getRandomValues) {
    return createUuidV4Fallback();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const value = token === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function normalizeCount(count) {
  const parsed = Number(count);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return Math.floor(parsed);
}

function generateBatch(count) {
  const size = normalizeCount(count);
  const rows = new Array(size);

  for (let i = 0; i < size; i += 1) {
    rows[i] = createUuid();
  }

  return rows;
}

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(10);
  const [batch, setBatch] = useState(() => generateBatch(10));
  const [allowLargeBatch, setAllowLargeBatch] = useState(false);

  const normalizedCount = normalizeCount(count);
  const overLimit = normalizedCount > UUID_WARNING_LIMIT;
  const canGenerate = normalizedCount > 0 && (!overLimit || allowLargeBatch);

  useEffect(() => {
    if (!overLimit && allowLargeBatch) {
      setAllowLargeBatch(false);
    }
  }, [allowLargeBatch, overLimit]);

  const output = useMemo(() => batch.join('\n'), [batch]);

  const regenerate = () => {
    if (!canGenerate) {
      return;
    }
    setBatch(generateBatch(count));
  };

  const forceGenerate = () => {
    setAllowLargeBatch(true);
    if (normalizedCount > 0) {
      setBatch(generateBatch(count));
    }
  };

  const downloadTxt = () => {
    if (!output) {
      return;
    }

    downloadTextFile({
      content: output,
      filename: `uuids-${batch.length}.txt`,
      mime: 'text/plain;charset=utf-8',
    });
  };

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC 4122 UUID v4 values in lightweight batches."
      controls={
        <>
          <input
            type="number"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="ui-select w-24"
          />
          <button
            type="button"
            onClick={regenerate}
            disabled={!canGenerate}
            className="ui-btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Generate
          </button>
        </>
      }
      input={
        <div className="flex h-full flex-col gap-3">
          {overLimit && !allowLargeBatch ? (
            <OverLimitNotice
              message={`Large batch (${normalizedCount.toLocaleString()} UUIDs). This can slow down or crash your browser.`}
              actionLabel="Generate anyway"
              onAction={forceGenerate}
            />
          ) : null}
          <div className="ui-surface p-4 text-sm ui-muted">
            Produces deterministic-size UUID batches with no external dependency.
          </div>
        </div>
      }
      outputMeta={`${batch.length} values`}
      output={output ? <CodeBlock text={output} /> : <span className="ui-muted">UUIDs appear here</span>}
      outputCopyText={output}
      outputCopyDisabled={!output}
      outputActions={
        <button
          type="button"
          onClick={downloadTxt}
          disabled={!output}
          className="ui-btn px-3 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          Download
        </button>
      }
    />
  );
}
