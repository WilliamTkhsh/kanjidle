import { stripDiacritics } from "../utils/strings";

// Aplica as regras: verde só quando o tamanho da tentativa é IGUAL ao da resposta.
// Tamanho diferente: apenas amarelo (presente) ou cinza (ausente), e adiciona lengthState.
export function scoreGuess(guess, answer) {
  const g = stripDiacritics(guess);
  const a = stripDiacritics(answer);
  const res = Array(g.length).fill("absent");

  if (g.length === a.length) {
    // Wordle completo
    const counts = {};
    for (let i = 0; i < a.length; i++) {
      if (g[i] === a[i]) continue;
      counts[a[i]] = (counts[a[i]] || 0) + 1;
    }
    for (let i = 0; i < a.length && i < g.length; i++) {
      if (g[i] === a[i]) res[i] = "correct";
    }
    for (let i = 0; i < a.length && i < g.length; i++) {
      if (res[i] === "correct") continue;
      const ch = g[i];
      if (counts[ch] > 0) {
        res[i] = "present";
        counts[ch]--;
      }
    }
    res.lengthState = "equal";
    return res;
  }

  // Diferente → sem verde (correct)
  const countsAll = {};
  for (let i = 0; i < a.length; i++) countsAll[a[i]] = (countsAll[a[i]] || 0) + 1;
  for (let i = 0; i < g.length; i++) {
    const ch = g[i];
    if (countsAll[ch] > 0) {
      res[i] = "present";
      countsAll[ch]--;
    }
  }
  res.lengthState = g.length > a.length ? "longer" : "shorter";
  return res;
}