import { memo, useMemo } from 'react';
import { highlightCode } from '../utils/syntaxHighlight.js';

const CodeBlock = memo(function CodeBlock({ text }) {
  const highlighted = useMemo(() => {
    return highlightCode(text || '');
  }, [text]);

  return <pre className="code-text" dangerouslySetInnerHTML={{ __html: highlighted }} />;
});

export default CodeBlock;
