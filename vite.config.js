import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function devApiProxy() {
  return {
    name: 'dev-api-proxy',
    configureServer(server) {
      server.middlewares.use('/__proxy', async (req, res) => {
        const remoteAddress = req.socket?.remoteAddress || '';
        const isLoopback =
          remoteAddress === '127.0.0.1' ||
          remoteAddress === '::1' ||
          remoteAddress === '::ffff:127.0.0.1';

        if (!isLoopback) {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Proxy is only available on localhost' }));
          return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }

        let payload;
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          payload = raw ? JSON.parse(raw) : {};
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }));
          return;
        }

        const targetUrl = payload?.url;
        const method = String(payload?.method || 'GET').toUpperCase();
        const headers = payload?.headers && typeof payload.headers === 'object' ? payload.headers : {};
        const body = payload?.body;

        let parsed;
        try {
          parsed = new URL(String(targetUrl || ''));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Invalid target URL' }));
          return;
        }

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'Only http(s) URLs are allowed' }));
          return;
        }

        const hopByHop = new Set([
          'connection',
          'keep-alive',
          'proxy-authenticate',
          'proxy-authorization',
          'te',
          'trailer',
          'transfer-encoding',
          'upgrade',
          'host',
          'origin',
          'referer',
          'content-length',
        ]);

        const upstreamHeaders = {};
        for (const [key, value] of Object.entries(headers)) {
          const lower = key.toLowerCase();
          if (hopByHop.has(lower)) continue;
          if (value == null) continue;
          upstreamHeaders[key] = String(value);
        }

        const startedAt = Date.now();

        try {
          const upstream = await fetch(parsed.toString(), {
            method,
            headers: upstreamHeaders,
            body: method === 'GET' || method === 'HEAD' ? undefined : body ?? undefined,
          });

          const text = await upstream.text();
          const durationMs = Date.now() - startedAt;
          const responseHeaders = Object.fromEntries(upstream.headers.entries());

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: true,
              status: upstream.status,
              statusText: upstream.statusText,
              headers: responseHeaders,
              body: text,
              durationMs,
            }),
          );
        } catch (error) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: false,
              error: error?.message || 'Proxy request failed',
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devApiProxy()],
  build: {
    sourcemap: false,
    target: 'es2020',
  },
});
