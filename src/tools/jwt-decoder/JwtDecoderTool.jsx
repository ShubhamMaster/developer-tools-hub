import { useMemo, useState } from 'react';
import TextPanel from '../../components/TextPanel.jsx';
import ToolShell from '../../components/ToolShell.jsx';
import CodeBlock from '../../components/CodeBlock.jsx';
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

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decodes JWT header and payload locally without network calls."
      input={<TextPanel label="JWT Token" value={token} onChange={setToken} placeholder="Paste JWT token" />}
      output={
        error ? (
          <span className="text-red-700">{error}</span>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">Header</p>
              <CodeBlock text={header || 'Header appears here'} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">Payload</p>
              <CodeBlock text={payload || 'Payload appears here'} />
            </div>
          </div>
        )
      }
      outputCopyText={combinedOutput}
      outputCopyDisabled={!combinedOutput}
    />
  );
}
