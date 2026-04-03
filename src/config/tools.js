/**
 * Tool Registry
 *
 * Add a tool by:
 * 1) Creating the tool component under `src/tools/<slug>/...`
 * 2) Adding an entry here (no other code changes required)
 */

const tools = [
  {
    category: 'DevTools',
    group: 'Encoding & Formatting',
    name: 'Base64 Encoder / Decoder',
    slug: 'base64',
    component: 'base64/Base64Tool.jsx',
    description: 'String-first Base64 conversion with UTF-8 safety.',
    keywords: ['base64', 'encode', 'decode'],
  },
  {
    category: 'Data',
    group: 'Formatters',
    name: 'JSON Formatter',
    slug: 'json',
    component: 'json-formatter/JsonFormatterTool.jsx',
    description: 'Format, minify, and validate JSON with worker-based parsing.',
    keywords: ['json', 'format', 'minify', 'validate'],
  },
  {
    category: 'Security',
    group: 'JWT Tools',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    component: 'jwt-decoder/JwtDecoderTool.jsx',
    description: 'Decodes JWT header and payload locally without network calls.',
    keywords: ['jwt', 'token', 'decode'],
  },
  {
    category: 'DevTools',
    group: 'Text Utilities',
    name: 'Case Converter',
    slug: 'case-converter',
    component: 'case-converter/CaseConverterTool.jsx',
    description: 'Convert text into common programming and display casing styles.',
    keywords: ['case', 'camel', 'snake', 'kebab', 'pascal'],
  },
  {
    category: 'Data',
    group: 'Converters',
    name: 'Number Base Converter',
    slug: 'number-base',
    component: 'number-base-converter/NumberBaseConverterTool.jsx',
    description: 'Translate values between binary, octal, decimal, and hexadecimal.',
    keywords: ['base', 'binary', 'hex', 'octal', 'decimal'],
  },
  {
    category: 'Data',
    group: 'Converters',
    name: 'Timestamp Converter',
    slug: 'timestamp',
    component: 'timestamp-converter/TimestampConverterTool.jsx',
    description: 'Convert between Unix timestamps and human-readable dates.',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'time'],
  },
  {
    category: 'Data',
    group: 'Converters',
    name: 'Text ↔ CSV',
    slug: 'text-csv',
    component: 'text-csv/TextCsvTool.jsx',
    description: 'Import a .txt/.csv file and convert between plain text and CSV.',
    keywords: ['csv', 'text', 'import', 'export', 'convert'],
  },
  {
    category: 'Network',
    group: 'URL Tools',
    name: 'URL Encoder / Decoder',
    slug: 'url',
    component: 'url-converter/UrlConverterTool.jsx',
    description: 'Convert strings to URL-safe format and decode them back instantly.',
    keywords: ['url', 'encode', 'decode', 'percent'],
  },
  {
    category: 'Network',
    group: 'URL Tools',
    name: 'URL Inspector',
    slug: 'url-inspector',
    component: 'url-inspector/UrlInspectorTool.jsx',
    description: 'Break down URL structure and query parameters instantly.',
    keywords: ['url', 'inspect', 'query', 'params'],
  },
  {
    category: 'Network',
    group: 'HTTP Tools',
    name: 'API Tester',
    slug: 'api-tester',
    component: 'api-tester/ApiTesterTool.jsx',
    description: 'Simple fetch-based request runner for quick endpoint checks.',
    keywords: ['api', 'http', 'request', 'fetch'],
  },
  {
    category: 'DevTools',
    group: 'Testing',
    name: 'Regex Tester',
    slug: 'regex-tester',
    component: 'regex-tester/RegexTesterTool.jsx',
    description: 'Test expressions against large text with worker-based matching and preview highlights.',
    keywords: ['regex', 'pattern', 'test', 'match'],
  },
  {
    category: 'System',
    group: 'Generators',
    name: 'UUID Generator',
    slug: 'uuid',
    component: 'uuid/UuidGeneratorTool.jsx',
    description: 'Generate RFC 4122 UUID v4 values in lightweight batches.',
    keywords: ['uuid', 'guid', 'generate', 'v4'],
  },
];

export const CATEGORY_ORDER = [
  'Security',
  'Data',
  'Network',
  'Forensics',
  'System',
  'DevTools',
  'Advanced',
];

export default tools;
