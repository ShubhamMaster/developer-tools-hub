import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';

const MAX_HIGHLIGHT_CHARS = 120000;

export function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function detectLanguage(value) {
  const trimmed = value.trimStart();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  if (trimmed.startsWith('<')) {
    return 'markup';
  }

  if (/^\s*(curl|git|npm|pnpm|yarn)\b/m.test(value)) {
    return 'bash';
  }

  if (/^\s*(import|export|const|let|var|function|class)\b/m.test(value)) {
    return 'javascript';
  }

  return null;
}

export function highlightCode(value, language) {
  if (!value) return '';
  if (value.length > MAX_HIGHLIGHT_CHARS) {
    return escapeHtml(value);
  }

  const selectedLanguage = (language || detectLanguage(value) || '').toLowerCase();
  const grammar = selectedLanguage ? Prism.languages[selectedLanguage] : null;

  if (grammar) {
    return Prism.highlight(value, grammar, selectedLanguage);
  }

  return escapeHtml(value)
    .replace(/(https?:\/\/[^\s]+)/g, '<span class=\"tok-link\">$1</span>')
    .replace(/\b(\d{3,})\b/g, '<span class=\"tok-number\">$1</span>')
    .replace(/\b(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/g, '<span class=\"tok-keyword\">$1</span>');
}
