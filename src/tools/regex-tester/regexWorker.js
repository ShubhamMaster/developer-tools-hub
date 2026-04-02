self.onmessage = (event) => {
  const { text, pattern, flags } = event.data;

  if (!pattern) {
    self.postMessage({ ok: true, matches: [], error: '' });
    return;
  }

  try {
    const normalizedFlags = flags.includes('g') ? flags : `${flags}g`;
    const regex = new RegExp(pattern, normalizedFlags);
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({ index: match.index, value: match[0] });
      if (matches.length >= 2000) break;
      if (match[0].length === 0) regex.lastIndex += 1;
    }

    self.postMessage({ ok: true, matches, error: '' });
  } catch (error) {
    self.postMessage({ ok: false, matches: [], error: error.message });
  }
};
