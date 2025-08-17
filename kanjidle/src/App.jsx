import React, { useEffect, useState } from "react";

const stripDiacritics = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const onlyLetters = (s) => (s.match(/[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]/g) || []).join("");

const ENTRIES = [
  { 
    kanji: "動物", 
    gloss: ["movimento", "coisa"], 
    onyomi: ["dou", "butsu"], 
    answer: "animal" 
  },
  { 
    kanji: "大学", 
    gloss: ["grande", "aprender"], 
    onyomi: ["dai", "gaku"], 
    answer: "universidade" 
  },
  { 
    kanji: "電車", 
    gloss: ["eletricidade", "veículo"], 
    onyomi: ["den", "sha"], 
    answer: "trem" 
  },
  { 
    kanji: "無理", 
    gloss: ["nenhum", "razão"], 
    onyomi: ["mu", "ri"], 
    answer: "impossivel" 
  },
  { 
    kanji: "心配", 
    gloss: ["coração", "partilhar"], 
    onyomi: ["shin", "pai"], 
    answer: "preocupação" 
  },
  { 
    kanji: "天気", 
    gloss: ["céu", "espírito"], 
    onyomi: ["ten", "ki"], 
    answer: "clima" 
  },
  { 
    kanji: "火山", 
    gloss: ["fogo", "montanha"], 
    onyomi: ["ka", "zan"], 
    answer: "vulcão" 
  },
  { 
    kanji: "手紙", 
    gloss: ["mão", "papel"], 
    onyomi: ["te", "gami"], 
    answer: "carta" 
  },
  { 
    kanji: "映画", 
    gloss: ["projetar", "quadro"], 
    onyomi: ["ei", "ga"], 
    answer: "filme" 
  },
  { 
    kanji: "自転車", 
    gloss: ["si mesmo", "girar", "veículo"], 
    onyomi: ["ji", "ten", "sha"], 
    answer: "bicicleta" 
  },
  { 
    kanji: "図書館", 
    gloss: ["desenho", "livro", "prédio"], 
    onyomi: ["to", "sho", "kan"], 
    answer: "biblioteca" 
  },
  { 
    kanji: "新聞", 
    gloss: ["novo", "escuta"], 
    onyomi: ["shin", "bun"], 
    answer: "jornal" 
  },
  { 
    kanji: "医者", 
    gloss: ["medicina", "pessoa"], 
    onyomi: ["i", "sha"], 
    answer: "médico" 
  },
  { 
    kanji: "経済", 
    gloss: ["passar", "ajustar"], 
    onyomi: ["kei", "zai"], 
    answer: "economia" 
  },
  { 
    kanji: "文化", 
    gloss: ["escrita", "mudança"], 
    onyomi: ["bun", "ka"], 
    answer: "cultura" 
  },
  { 
    kanji: "自然", 
    gloss: ["si mesmo", "assim"], 
    onyomi: ["shi", "zen"], 
    answer: "natureza" 
  }
];

// Escolhe uma entrada aleatória; se "excludeAnswer" for passado, evita repetir a mesma da rodada
const pickRandom = (excludeAnswer = null) => {
  const pool = excludeAnswer
    ? ENTRIES.filter((e) => stripDiacritics(e.answer) !== stripDiacritics(excludeAnswer))
    : ENTRIES;
  return pool[Math.floor(Math.random() * pool.length)];
};

function scoreGuess(guess, answer) {
  const g = stripDiacritics(guess);
  const a = stripDiacritics(answer);
  const res = Array(g.length).fill("absent");

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
  return res;
}

const kanjiClass = "text-6xl font-extrabold text-center";

export default function App() {
  const [entry, setEntry] = useState(() => pickRandom());
  const [answer, setAnswer] = useState(entry.answer);
  const [guesses, setGuesses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [win, setWin] = useState(false);
  const [message, setMessage] = useState("");

  const attempts = 6;

  useEffect(() => {
    setAnswer(entry.answer);
    setGuesses([]);
    setEvaluations([]);
    setCurrent("");
    setGameOver(false);
    setGameOverModal(false);
    setWin(false);
    setMessage("");
  }, [entry]);

  const showToast = (t) => {
    setMessage(t);
    setTimeout(() => setMessage(""), 1500);
  };

  const onEnter = () => {
    const typed = current.trim();
    if (!typed) return;
    const evalRow = scoreGuess(typed, answer);
    const newGuesses = [...guesses, typed];
    const newEvals = [...evaluations, evalRow];
    setGuesses(newGuesses);
    setEvaluations(newEvals);
    setCurrent("");

    const won = stripDiacritics(typed) === stripDiacritics(answer);
    const finished = won || newGuesses.length >= attempts;
    if (won) {
      setWin(true);
      setGameOver(true);
      setGameOverModal(true);
      showToast("Acertou!");
    } else if (finished) {
      setGameOver(true);
      setGameOverModal(true);
      showToast(`Fim. Resposta: ${answer.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col items-center p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-700">KANJIDLE</h1>
        <p className="text-sm text-slate-600">
          Adivinhe a palavra em português a partir dos significados dos kanjis
        </p>
      </header>

    <div className="bg-white rounded-3xl shadow-lg p-6 max-w-lg w-full mb-6">
      <div className={kanjiClass}>
        <div className="flex justify-center space-x-2">
          {entry.kanji.split("").map((k, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-purple-500 text-sm font-semibold">{entry.onyomi[i]}</span>
              <span className="text-4xl font-bold">{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        {entry.gloss.map((g, i) => (
          <div
            key={i}
            className="bg-purple-100 rounded-xl px-3 py-2 text-sm text-purple-800 font-medium"
          >
            {entry.kanji[i]} = {g}
          </div>
        ))}
      </div>
    </div>

      <div className="flex flex-col gap-2 mb-4 w-full max-w-lg">
        {guesses.map((g, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 flex-wrap">
            {g.split("").map((ch, i) => {
              const st = evaluations[rIdx][i];
              const base = "w-10 h-12 flex items-center justify-center rounded-lg font-bold text-lg";
              const style =
                st === "correct"
                  ? "bg-green-500 text-white"
                  : st === "present"
                  ? "bg-yellow-400 text-white"
                  : "bg-slate-300 text-slate-900";
              return (
                <div key={i} className={`${base} ${style}`}>
                  {ch.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
        {!gameOver && (
          <input
            className="mt-2 w-full border-2 border-indigo-300 rounded-xl p-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={current}
            onChange={(e) => setCurrent(onlyLetters(e.target.value))}
            placeholder="Digite sua tentativa"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
              }
            }}
          />
        )}
      </div>

      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-700 text-white px-4 py-2 rounded-full shadow">
          {message}
        </div>
      )}

      {gameOver && gameOverModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow max-w-sm w-full text-center">
            <div className="text-2xl font-bold mb-2">{win ? "Parabéns!" : "Fim de jogo"}</div>
            <div className="text-slate-600 mb-4">
              Resposta: <span className="font-semibold">{answer.toUpperCase()}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setEntry(pickRandom(entry.answer))}
                className="px-3 py-2 rounded-2xl bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Jogar outra
              </button>
              <button
                onClick={() => setGameOverModal(false)}
                className="px-3 py-2 rounded-2xl bg-slate-200 text-slate-800 shadow hover:bg-slate-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 text-xs text-slate-500">Acentos são opcionais</footer>
    </div>
  );
}
