import { normalizeForDict } from "../utils/strings";

let _setPromise = null; // Promise<Set<string>> com palavras normalizadas

export async function getWordSet() {
    if (_setPromise) return _setPromise;
    _setPromise = (async () => {
        const mod = await import("an-array-of-portuguese-words");
        const arr = mod.default || mod; // CJS/ESM compat
        const words = Array.isArray(arr) ? arr : (arr?.default || []);
        return new Set(words.map((w) => normalizeForDict(String(w || ""))));
    })();
    return _setPromise;
}

export async function isValidWord(word) {
    try {
        const set = await getWordSet();
        return set.has(normalizeForDict(word));
    } catch {
        return false;
    }
}

export async function warmupSpell() {
    try { await getPtSpell(); } catch {}
}