self.onmessage = (event) => {
  const { text, mode } = event.data;

  if (!text || !text.trim()) {
    self.postMessage({ ok: true, output: '' });
    return;
  }

  try {
    const parsed = JSON.parse(text);

    if (mode === 'minify') {
      self.postMessage({ ok: true, output: JSON.stringify(parsed) });
      return;
    }

    if (mode === 'validate') {
      self.postMessage({ ok: true, output: 'Valid JSON' });
      return;
    }

    self.postMessage({ ok: true, output: JSON.stringify(parsed, null, 2) });
  } catch (error) {
    self.postMessage({ ok: false, output: '', error: error.message });
  }
};
