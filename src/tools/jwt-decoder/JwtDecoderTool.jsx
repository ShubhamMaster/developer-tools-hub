import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import OutputPanel from '../../components/OutputPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import { parseJwtToken } from '../../utils/formatters.js';

export default function JwtDecoderTool() {
  const [token, setToken] = useState('');

  const { header, payload, error } = useMemo(() => {
    if (!token.trim()) return { header: '', payload: '', error: '' };
    try {
      const parsed = parseJwtToken(token.trim());
      return {
        header: JSON.stringify(parsed.header, null, 2),
        payload: JSON.stringify(parsed.payload, null, 2),
        error: '',
      };
    } catch (e) {
      return { header: '', payload: '', error: e.message };
    }
  }, [token]);

  const combinedOutput = `${header}${header && payload ? '\n\n' : ''}${payload}`;

  const copyOutput = async () => {
    if (!combinedOutput) return;
    await navigator.clipboard.writeText(combinedOutput);
  };

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decodes JWT header and payload locally without network calls."
      input={<TextPanel label="JWT Token" value={token} onChange={setToken} placeholder="Paste JWT token" />}
      output={
        <OutputPanel title="Decoded" output={combinedOutput} onCopy={copyOutput} copyDisabled={!combinedOutput}>
          {error ? (
            <span className="text-red-700">{error}</span>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-600">Header</p>
                <pre>{header || 'Header appears here'}</pre>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-600">Payload</p>
                <pre>{payload || 'Payload appears here'}</pre>
              </div>
            </div>
          )}
        </OutputPanel>
      }
    />
  );
}
