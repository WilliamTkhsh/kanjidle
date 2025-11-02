import { createFilter } from 'vite';

export default function obfuscateEntriesPlugin() {
  const filter = createFilter(/src[\/\\]entries\.js$/);
  return {
    name: 'obfuscate-entries',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      const norm = id.replace(/\\/g, '/');
      if (!filter(norm)) return null;
      // Captura o literal do array ENTRIES
      const match = code.match(/const\s+ENTRIES\s*=\s*(\[[\s\S]*?\]);?/);
      if (!match) return null;
      const arrayLiteral = match[1];
      const key = 'kanjidle@2025';
      const buf = Buffer.from(arrayLiteral, 'utf8');
      const out = Buffer.alloc(buf.length);
      for (let i = 0; i < buf.length; i++) {
        out[i] = buf[i] ^ key.charCodeAt(i % key.length);
      }
      const b64 = out.toString('base64');

      const runtime = `export default (function(){\n`+
`  const b64 = '${b64}';\n`+
`  const key = '${key}';\n`+
`  const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64,'base64').toString('binary');\n`+
`  const len = bin.length;\n`+
`  const bytes = new Uint8Array(len);\n`+
`  for (let i=0;i<len;i++){ bytes[i] = bin.charCodeAt(i) ^ key.charCodeAt(i % key.length); }\n`+
`  const src = new TextDecoder().decode(bytes);\n`+
`  return eval('(' + src + ')');\n`+
`})();`;

      return { code: runtime, map: null };
    },
  };
}

