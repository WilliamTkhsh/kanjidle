import React, { useMemo } from "react";
import { useTheme, getTheme } from "../theme";
import { stripDiacritics, MAX_INPUT_LEN } from "../utils/strings";

const ROW1 = "QWERTYUIOP".split("");
const ROW2 = "ASDFGHJKL".split("");
const ROW3 = "ZXCVBNM".split("");

const STATE_PRIORITY = { absent: 0, present: 1, correct: 2 };

function computeKeyStatuses(guesses, evaluations) {
  const map = {};
  for (let r = 0; r < guesses.length; r++) {
    const g = guesses[r] || "";
    const evalRow = evaluations[r] || [];
    for (let i = 0; i < g.length; i++) {
      const key = stripDiacritics(g[i]).toUpperCase();
      const st = evalRow[i] || "absent";
      const curr = map[key];
      if (!curr || STATE_PRIORITY[st] > STATE_PRIORITY[curr]) map[key] = st;
    }
  }
  return map;
}

export default function Keyboard({
  guesses,
  evaluations,
  onChar,
  onEnter,
  onBackspace,
  disabled,
  currentLen = 0,
  maxLen = MAX_INPUT_LEN,
  totalAttempts
}) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  const keyStates = useMemo(() => computeKeyStatuses(guesses, evaluations), [guesses, evaluations]);

  const used = (guesses?.length) || 0;
  const total = totalAttempts || 0;
  const ratio = total ? used / total : 0;
  const attemptsColor = ratio >= 0.9
    ? "text-red-500"
    : ratio >= 0.75
    ? "text-orange-500"
    : ratio >= 0.5
    ? "text-yellow-500"
    : (dark ? "text-slate-100" : "text-slate-800");  

  // Estilo base + feedback (hover/active/focus)
  const keyBase = "h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center select-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed";
  const styleFor = (k) => {
    const st = keyStates[k];
    if (st === "correct") return "bg-green-500 text-white hover:bg-green-400 active:bg-green-300";
    if (st === "present") return "bg-yellow-500 text-white hover:bg-yellow-400 active:bg-yellow-300";
    if (st === "absent") return dark
      ? "bg-slate-800 text-slate-300 hover:bg-slate-600 active:bg-slate-500"
      : "bg-slate-300 text-slate-800 hover:bg-slate-200 active:bg-slate-100";
    // desconhecido (ENTER/⌫)
    return dark
      ? "bg-slate-600 text-slate-100 hover:bg-slate-500 active:bg-slate-400"
      : "bg-slate-200 text-slate-900 hover:bg-slate-100 active:bg-white";
  };

  const SIZE_NORMAL = "w-10 sm:w-11 md:w-12"; // letras
  const SIZE_WIDE = "w-24 sm:w-28 md:w-32";   // ENTER

  const tryAdd = (k) => {
    if (disabled) return;
    if (currentLen >= maxLen) return;
    onChar?.(k);
  };

  const Key = ({ label, onClick, wide = false, ariaLabel }) => (
    <button
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={onClick}
      className={`${keyBase} ${wide ? SIZE_WIDE : SIZE_NORMAL} ${styleFor(label)}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-2">
      <div className="text-center -mb-1">
        <span className={`text-lg font-extrabold tracking-wide ${attemptsColor}`}>{used}/{totalAttempts}</span>
      </div>      
      {/* Linha 1 */}
      <div className="flex justify-center gap-2">
        {ROW1.map((k) => (
          <Key key={k} label={k} onClick={() => tryAdd(k)} />
        ))}
      </div>

      {/* Linha 2 (deslocada e com BACKSPACE no fim) */}
      <div className="flex justify-center gap-2 px-4">
        {ROW2.map((k) => (
          <Key key={k} label={k} onClick={() => tryAdd(k)} />
        ))}
        <Key label="⌫" ariaLabel="Apagar" onClick={() => onBackspace?.()} />
      </div>

      {/* Linha 3 (mais deslocada e com ENTER largo no fim) */}
      <div className="flex justify-center gap-2 px-8">
        {ROW3.map((k) => (
          <Key key={k} label={k} onClick={() => tryAdd(k)} />
        ))}
        <Key label="ENTER" wide ariaLabel="Enviar" onClick={() => onEnter?.()} />
      </div>
    </div>
  );
}