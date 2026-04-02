import { decodeBase64Url } from './stringUtils';

export function parseJwtToken(token) {
  const segments = token.split('.');
  if (segments.length < 2) {
    throw new Error('Token must contain at least two segments.');
  }

  const header = JSON.parse(decodeBase64Url(segments[0]));
  const payload = JSON.parse(decodeBase64Url(segments[1]));

  return { header, payload };
}

export function safeJsonParse(value) {
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}
