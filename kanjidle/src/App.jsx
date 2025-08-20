import React, { useEffect, useState, useCallback } from "react";

const stripDiacritics = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const onlyLetters = (s) => (s.match(/[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]/g) || []).join("");

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
  const [entriesList, setEntriesList] = useState(null);
  const [entry, setEntry] = useState(null);
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [win, setWin] = useState(false);
  const [message, setMessage] = useState("");

  // NEW: UI state
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const attempts = 6;

  const pickRandom = useCallback(
    (excludeAnswer = null) => {
      if (!entriesList) return null;
      const pool = excludeAnswer
        ? entriesList.filter(
            (e) => stripDiacritics(e.answer) !== stripDiacritics(excludeAnswer)
          )
        : entriesList;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    [entriesList]
  );

  useEffect(() => {
    // Load saved theme preference
    const saved = localStorage.getItem("kanjidle-dark");
    if (saved === "1") setDarkMode(true);

    const loadEntries = async () => {
      const module = await import("./entries.js");
      const loadedEntries = module.default;
      setEntriesList(loadedEntries);

      const initialEntry =
        loadedEntries[Math.floor(Math.random() * loadedEntries.length)];
      setEntry(initialEntry);
    };
    loadEntries();
  }, []);

  useEffect(() => {
    if (entry) {
      setAnswer(entry.answer);
      setGuesses([]);
      setEvaluations([]);
      setCurrent("");
      setGameOver(false);
      setGameOverModal(false);
      setWin(false);
      setMessage("");
    }
  }, [entry]);

  useEffect(() => {
    localStorage.setItem("kanjidle-dark", darkMode ? "1" : "0");
  }, [darkMode]);

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

  if (!entry) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 to-slate-800"
            : "bg-gradient-to-br from-purple-50 to-indigo-100"
        }`}
      >
        <p className={`text-xl font-semibold ${darkMode ? "text-indigo-200" : "text-indigo-700"}`}>
          Carregando jogo...
        </p>
      </div>
    );
  }

  const pageBg = darkMode
    ? "bg-gradient-to-br from-slate-900 to-slate-800"
    : "bg-gradient-to-br from-purple-50 to-indigo-100";
  const cardBg = darkMode ? "bg-slate-900/70 backdrop-blur text-slate-100" : "bg-white";
  const subText = darkMode ? "text-slate-300" : "text-slate-600";
  const titleText = darkMode ? "text-indigo-200" : "text-indigo-700";
  const pillBg = darkMode ? "bg-slate-700 text-slate-100" : "bg-purple-100 text-purple-800";
  const inputStyle = darkMode
    ? "border-slate-600 bg-slate-800 text-slate-100 focus:ring-indigo-400"
    : "border-indigo-300 bg-white text-slate-900 focus:ring-indigo-500";
  const modalBg = darkMode ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900";
  const btnPrimary = darkMode
    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
    : "bg-indigo-600 hover:bg-indigo-700 text-white";
  const btnSecondary = darkMode
    ? "bg-slate-600 hover:bg-slate-500 text-white"
    : "bg-slate-200 hover:bg-slate-300 text-slate-800";

  return (
    <div className={`min-h-screen ${pageBg} flex flex-col items-center p-6`}>
      {/* Top bar */}
      <header className="w-full max-w-lg flex items-center justify-between mb-6">
        <div className="text-left">
          <h1 className={`text-3xl font-extrabold ${titleText}`}>KANJIDLE</h1>
          <p className={`text-sm ${subText}`}>
            Adivinhe a palavra em português a partir dos significados dos kanjis
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Instructions button */}
          <button
            aria-label="Instruções"
            onClick={() => setShowInstructions(true)}
            className={`p-2 rounded-xl shadow ${btnSecondary}`}
            title="Como jogar"
          >
            {/* Question mark icon */}
            <img src="kanjidle/src/assets/question-circle-svgrepo-com.svg" alt="Como Jogar" className="w-8 h-8" />
          </button>
          {/* Settings button */}
          <button
            aria-label="Configurações"
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-xl shadow ${btnSecondary}`}
            title="Configurações"
          >
            {/* Gear icon */}
            <img src="kanjidle/src/assets/gear-svgrepo-com.svg" alt="Configurações" className="w-8 h-8" />
          </button>
        </div>
      </header>

      {/* KANJI + GLOSSES CARD */}
      <div className={`${cardBg} rounded-3xl shadow-lg p-6 max-w-lg w-full mb-6`}>
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
            <div key={i} className={`rounded-xl px-3 py-2 text-sm font-medium ${pillBg}`}>
              {entry.kanji[i]} = {g}
            </div>
          ))}
        </div>
      </div>

      {/* GUESSES / INPUT */}
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
                  ? "bg-yellow-500 text-white"
                  : darkMode
                  ? "bg-slate-600 text-slate-100"
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
            className={`mt-2 w-full border-2 rounded-xl p-3 text-center text-lg focus:outline-none focus:ring-2 ${inputStyle}`}
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

      {/* TOAST */}
      {message && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow">
          {message}
        </div>
      )}

      {/* GAME OVER MODAL */}
      {gameOver && gameOverModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className={`${modalBg} rounded-2xl p-6 shadow max-w-sm w-full text-center`}>
            <div className="text-2xl font-bold mb-2">{win ? "Parabéns!" : "Fim de jogo"}</div>
            <div className={`mb-4 ${subText}`}>
              Resposta: <span className="font-semibold text-inherit">{answer.toUpperCase()}</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setEntry(pickRandom(entry.answer))}
                className={`px-3 py-2 rounded-2xl shadow ${btnPrimary}`}
              >
                Jogar outra
              </button>
              <button
                onClick={() => setGameOverModal(false)}
                className={`px-3 py-2 rounded-2xl shadow ${btnSecondary}`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSTRUCTIONS MODAL */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className={`${modalBg} rounded-2xl p-6 shadow max-w-md w-full`}>
            <h2 className="text-xl font-bold mb-2">Como jogar</h2>
            <ol className={`list-decimal pl-5 space-y-2 mb-4 ${subText}`}>
              <li>Observe os kanjis e seus significados individuais (glossas) no topo.</li>
              <li>Digite em <strong>português</strong> a palavra alvo que resulta da combinação desses significados.</li>
              <li>Você tem <strong>{attempts}</strong> tentativas. As cores das letras indicam:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white">correto</span>: letra certa no lugar certo;</li>
                  <li><span className="inline-block px-2 py-0.5 rounded bg-yellow-500 text-white">presente</span>: letra existe na palavra, mas em outra posição;</li>
                  <li><span className="inline-block px-2 py-0.5 rounded bg-slate-400 text-white">ausente</span>: letra não aparece.</li>
                </ul>
              </li>
              <li>Acentos são opcionais ("cafe" = "café").</li>
              <li>Pressione <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-800">Enter</kbd> para enviar a tentativa.</li>
            </ol>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowInstructions(false)} className={`px-3 py-2 rounded-2xl shadow ${btnPrimary}`}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className={`${modalBg} rounded-2xl p-6 shadow max-w-sm w-full`}>
            <h2 className="text-xl font-bold mb-4">Configurações</h2>

            {/* Dark mode toggle */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-medium">Tema escuro</div>
                <div className={`${subText} text-sm`}>Ativa o modo dark para reduzir o brilho.</div>
              </div>
              <button
                role="switch"
                aria-checked={darkMode}
                onClick={() => setDarkMode((v) => !v)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                  darkMode ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                    darkMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowSettings(false)} className={`px-3 py-2 rounded-2xl shadow ${btnSecondary}`}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className={`mt-8 text-xs ${subText}`}>Acentos são opcionais</footer>
    </div>
  );
}
