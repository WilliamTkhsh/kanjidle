const PREFIX = "kanjidle";

export const attemptsKey = (dateStr) => `${PREFIX}:attempts:${dateStr}`;
export const stateKey = (dateStr) => `${PREFIX}:state:${dateStr}`; // se quiser salvar mais coisas depois

export function loadAttempts(dateStr) {
  try {
    const raw = localStorage.getItem(attemptsKey(dateStr));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAttempts(dateStr, attempts) {
  try {
    localStorage.setItem(attemptsKey(dateStr), JSON.stringify(attempts.slice(0, 12)));
  } catch {}
}
