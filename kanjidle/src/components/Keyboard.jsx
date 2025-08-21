import React, { useMemo } from "react";
import { useTheme, getTheme } from "../theme";
import { stripDiacritics } from "../utils/strings";


const ROW1 = "QWERTYUIOP".split("");
const ROW2_LETTERS = "ASDFGHJKL".split("");
const ROW3_LETTERS = "ZXCVBNM".split("");


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
return map; // ex.: { A: 'present', V: 'correct', R: 'absent' }
}


export default function Keyboard({ guesses, evaluations, onChar, onEnter, onBackspace, disabled }) {
const { dark } = useTheme();
const styles = getTheme(dark);
const keyStates = useMemo(() => computeKeyStatuses(guesses, evaluations), [guesses, evaluations]);


const keyBase = "h-12 w-full rounded-xl font-bold text-sm sm:text-base flex items-center justify-center select-none";
const styleFor = (k) => {
const st = keyStates[k];
if (st === "correct") return "bg-green-500 text-white";
if (st === "present") return "bg-yellow-500 text-white";
if (st === "absent") return dark ? "bg-slate-700 text-slate-300" : "bg-slate-300 text-slate-800";
return dark ? "bg-slate-600 text-slate-100" : "bg-slate-200 text-slate-900"; // desconhecido
};


const Key = ({ label, onClick }) => (
<button disabled={disabled} onClick={onClick} className={`${keyBase} ${styleFor(label)}`}>
{label}
</button>
);


const Spacer = () => <div className="h-12 w-full rounded-xl opacity-0 pointer-events-none" />;


// Linhas com exatamente 10 colunas para todas as teclas terem o MESMO tamanho
const row1 = ROW1; // 10
const row2 = [...ROW2_LETTERS, "ENTER"]; // 9 + 1 = 10 (ENTER na linha 2)
const row3 = [...ROW3_LETTERS, "⌫"]; // 7 + 1 = 8 → +2 spacers para fechar 10


return (
<div className="w-full max-w-lg mx-auto grid gap-2">
{/* Linha 1 */}
<div className="grid grid-cols-10 gap-2">
{row1.map((k) => (
<Key key={k} label={k} onClick={() => onChar?.(k)} />
))}
</div>


{/* Linha 2 (com ENTER) */}
<div className="grid grid-cols-10 gap-2">
{row2.map((k) =>
k === "ENTER" ? (
<Key key="ENTER" label="ENTER" onClick={() => onEnter?.()} />
) : (
<Key key={k} label={k} onClick={() => onChar?.(k)} />
)
)}
</div>

{/* Linha 3 (com ⌫ + espaçadores para padronizar largura) */}
<div className="grid grid-cols-10 gap-2">
<Spacer />
{row3.map((k) =>
k === "⌫" ? (
<Key key="BACKSPACE" label="⌫" onClick={() => onBackspace?.()} />
) : (
<Key key={k} label={k} onClick={() => onChar?.(k)} />
)
)}
<Spacer />
</div>
</div>
);
}