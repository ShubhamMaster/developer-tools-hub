import { lazy } from 'react';

export const toolLoaders = {
  json: lazy(() => import('../tools/json-formatter/JsonFormatterTool.jsx')),
  base64: lazy(() => import('../tools/base64/Base64Tool.jsx')),
  jwt: lazy(() => import('../tools/jwt-decoder/JwtDecoderTool.jsx')),
  regex: lazy(() => import('../tools/regex-tester/RegexTesterTool.jsx')),
  api: lazy(() => import('../tools/api-tester/ApiTesterTool.jsx')),
  url: lazy(() => import('../tools/url-inspector/UrlInspectorTool.jsx')),
  time: lazy(() => import('../tools/timestamp-converter/TimestampConverterTool.jsx')),
  uuid: lazy(() => import('../tools/uuid/UuidGeneratorTool.jsx')),
  urlcodec: lazy(() => import('../tools/url-converter/UrlConverterTool.jsx')),
  case: lazy(() => import('../tools/case-converter/CaseConverterTool.jsx')),
  numberbase: lazy(() => import('../tools/number-base-converter/NumberBaseConverterTool.jsx')),
};
