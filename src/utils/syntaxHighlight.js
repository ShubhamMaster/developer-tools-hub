const MAX_HIGHLIGHT_CHARS = 120000;

export function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function looksLikeJson(value) {
  const trimmed = value.trim();
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function highlightJson(value) {
  const escaped = escapeHtml(value);
  return escaped.replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\\"])*"\s*:|"(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\\"])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g,
    (token) => {
      if (token.endsWith(':')) {
        return `<span class=\"tok-key\">${token}</span>`;
      }
      if (token[0] === '"') {
        return `<span class=\"tok-string\">${token}</span>`;
      }
      if (token === 'true' || token === 'false') {
        return `<span class=\"tok-boolean\">${token}</span>`;
      }
      if (token === 'null') {
        return `<span class=\"tok-null\">${token}</span>`;
      }
      return `<span class=\"tok-number\">${token}</span>`;
    },
  );
}

export function highlightCode(value) {
  if (!value) return '';
  if (value.length > MAX_HIGHLIGHT_CHARS) {
    return escapeHtml(value);
  }

  if (looksLikeJson(value)) {
    return highlightJson(value);
  }

  return escapeHtml(value)
    .replace(/(https?:\/\/[^\s]+)/g, '<span class=\"tok-link\">$1</span>')
    .replace(/\b(\d{3,})\b/g, '<span class=\"tok-number\">$1</span>')
    .replace(/\b(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/g, '<span class=\"tok-keyword\">$1</span>');
}
