// Vite plugin para ofuscar src/entries.js gerando JSON ofuscado
import { pathToFileURL } from 'node:url';

export default function obfuscateEntriesPlugin() {
  return {
    name: 'obfuscate-entries',
    apply: 'build',
    enforce: 'pre',
    async transform(code, id) {
      const norm = id.replace(/\\/g, '/');
      const clean = norm.replace(/\?.*$/, '');
      if (!clean.endsWith('/src/entries.js')) return null;

      // Importa diretamente o módulo de entries via filesystem
      let arrayJSON = null;
      try {
        const fileUrl = pathToFileURL(clean).href;
        const mod = await import(fileUrl + `?v=${Date.now()}`);
        const arr = mod && mod.default;
        if (Array.isArray(arr)) arrayJSON = JSON.stringify(arr);
      } catch {}

      if (!arrayJSON) {
        arrayJSON = '[]';
      }

      // 3) Ofusca (XOR+Base64) o conteúdo (JSON ou literal do array)
      const key = 'kanjidle@2025';
      const buf = Buffer.from(arrayJSON, 'utf8');
      const out = Buffer.alloc(buf.length);
      for (let i = 0; i < buf.length; i++) out[i] = buf[i] ^ key.charCodeAt(i % key.length);
      const b64 = out.toString('base64');

      // 4) Runtime decoder com UTF-8 robusto e parse seguro
      const runtime = `export default (function(){\n`
        + `  const b64 = '${b64}';\n`
        + `  const key = '${key}';\n`
        + `  const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64,'base64').toString('binary');\n`
        + `  const len = bin.length;\n`
        + `  const bytes = new Uint8Array(len);\n`
        + `  for (let i=0;i<len;i++){ bytes[i] = bin.charCodeAt(i) ^ key.charCodeAt(i % key.length); }\n`
        + `  function utf8Decode(arr){ let out='',i=0; while(i<arr.length){ const c=arr[i++]; if(c<0x80){ out+=String.fromCharCode(c); continue;} if((c&0xe0)===0xc0){const c2=arr[i++]; out+=String.fromCharCode(((c&0x1f)<<6)|(c2&0x3f)); continue;} if((c&0xf0)===0xe0){const c2=arr[i++],c3=arr[i++]; out+=String.fromCharCode(((c&0x0f)<<12)|((c2&0x3f)<<6)|(c3&0x3f)); continue;} const c2=arr[i++],c3=arr[i++],c4=arr[i++]; let cp=((c&0x07)<<18)|((c2&0x3f)<<12)|((c3&0x3f)<<6)|(c4&0x3f); cp-=0x10000; out+=String.fromCharCode(0xD800+(cp>>10),0xDC00+(cp&0x3FF)); } return out; }\n`
        + `  const s = (typeof TextDecoder !== 'undefined') ? new TextDecoder().decode(bytes) : utf8Decode(bytes);\n`
        + `  try { return JSON.parse(s); } catch (e1) { try { return (0,eval)('(' + s + ')'); } catch (e2) { return []; } }\n`
        + `})();`;

      return { code: runtime, map: null };
    },
  };
}
