const MS_PER_DAY = 86_400_000;

/** YYYY-MM-DD no fuso escolhido (padrão: America/Sao_Paulo) */
export function todayYMD(tz = "America/Sao_Paulo") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date()); // ex.: 2025-08-28
}

/** Dias inteiros entre epoch e hoje, ambos ancorados à "meia-noite" local do TZ */
export function daysSinceEpoch(epochYMD = "2025-01-01", tz = "America/Sao_Paulo") {
  const toMidnightUTCms = (ymd) => Date.parse(`${ymd}T00:00:00Z`);
  const today = todayYMD(tz);
  return Math.floor((toMidnightUTCms(today) - toMidnightUTCms(epochYMD)) / MS_PER_DAY);
}

/** Índice diário no intervalo [0, entriesLen) */
export function pickDailyIndex(entriesLen, {
  epochYMD = "2025-01-01",
  tz = "America/Sao_Paulo",
  offset = 0,
} = {}) {
  if (!Number.isInteger(entriesLen) || entriesLen <= 0) throw new Error("entriesLen inválido" + entriesLen);
  const n = daysSinceEpoch(epochYMD, tz) + offset;
  return ((n % entriesLen) + entriesLen) % entriesLen;
}
