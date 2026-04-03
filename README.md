# Developer Tools Hub

Developer Tools Hub is a local-first toolbox for engineers. It brings fast, readable utilities into one workspace so you can format data, test APIs, inspect tokens, and convert encodings without bouncing between sites.

## Highlights
- Local-first: most tools run entirely in the browser with no backend required
- Scalable registry: add tools by dropping a component and registering it
- Clean navigation: global search, favorites, and recents for quick access
- Built for speed: lazy-loaded tools and optimized render paths

## Tool Categories
- Data: JSON formatter, JSON/XML/YAML/CSV converters
- Security: JWT tools, hashing, AES-GCM, RSA, password utilities
- Encoding: Base64, HTML entities, binary/hex/unicode, case converters
- Network & Forensics: CORS analyzer, IP/subnet analyzer, EXIF viewer, entropy

## Getting Started

### Install
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Add a Tool
1. Create a tool component under `src/tools/<slug>/YourTool.jsx`
2. Register it in `src/config/tools.js` with category, group, name, slug, and component path

Tools are lazy-loaded through `import.meta.glob`, so new tools are picked up without extra wiring.

## API Tester (Dev Proxy)
In development, the API Tester can route requests through `/__proxy` to avoid CORS issues. The proxy is only available on localhost and rejects non-loopback requests.

## SEO
Global metadata is defined in `index.html` and page-specific metadata is set with `react-helmet-async` inside the dashboard and tool pages.

## License
MIT
