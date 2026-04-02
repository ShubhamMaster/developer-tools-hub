import { useMemo, useState } from 'react';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';

function generateBatch(count) {
  const size = Math.max(1, Math.min(200, count));
  const rows = new Array(size);

  for (let i = 0; i < size; i += 1) {
    rows[i] = crypto.randomUUID();
  }

  return rows;
}

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(10);
  const [batch, setBatch] = useState(() => generateBatch(10));

  const output = useMemo(() => batch.join('\n'), [batch]);

  const regenerate = () => setBatch(generateBatch(Number(count) || 1));

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC 4122 UUID v4 values in lightweight batches."
      controls={
        <>
          <input
            type="number"
            min="1"
            max="200"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <button
            type="button"
            onClick={regenerate}
            className="rounded-md border border-teal-500 bg-teal-50 px-3 py-2 text-sm text-teal-800 hover:bg-teal-100"
          >
            Generate
          </button>
        </>
      }
      input={
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Produces deterministic-size UUID batches with no external dependency.
        </div>
      }
      output={<OutputPanel title="UUIDs" output={output} onCopy={copyOutput} copyDisabled={!output} meta={`${batch.length} values`} />}
    />
  );
}
