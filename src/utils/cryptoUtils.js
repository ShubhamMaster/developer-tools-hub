export function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;

  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }

  return btoa(binary);
}

export function bufferToBase64(buffer) {
  return bytesToBase64(new Uint8Array(buffer));
}

export function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return base64ToBytes(padded);
}

export function bytesToBase64Url(bytes) {
  return bytesToBase64(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function bufferToBase64Url(buffer) {
  return bytesToBase64Url(new Uint8Array(buffer));
}

export function textToBase64Url(text) {
  return bytesToBase64Url(new TextEncoder().encode(text));
}

export function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}

export function textToBytes(text) {
  return new TextEncoder().encode(text);
}
