import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Header from "./components/Header";
import KanjiCard from "./components/KanjiCard";
import GuessGrid from "./components/GuessGrid";
import GuessInput from "./components/GuessInput";
import Toast from "./components/Toast";
import GameOverModal from "./components/modals/GameOverModal";
import InstructionsModal from "./components/modals/InstructionsModal";
import SettingsModal from "./components/modals/SettingsModal";
import { ThemeContext, getTheme } from "./theme";
import { scoreGuess } from "./utils/scoreGuess";
import { stripDiacritics, normalizeForDict } from "./utils/strings";

export default function App() {
  // Estado do jogo
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

  // UI
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Dicionário PT-BR (@andsfonseca/palavras-pt-br)
  const dictRef = useRef(null);

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
    // Preferência do tema
    const saved = localStorage.getItem("kanjidle-dark");
    if (saved === "1") setDarkMode(true);

    // Pré-carrega o dicionário para validar palavras (carregamento preguiçoso)
    import("@andsfonseca/palavras-pt-br").then((mod) => {
      // Força a base PYTHONPROBR conforme solicitado
      try { mod.Word.library = mod.PYTHONPROBR; } catch {}
      dictRef.current = mod.Word;
    }).catch(() => {
      // se falhar, seguimos sem travar o jogo
      dictRef.current = null;
    });

    const loadEntries = async () => {
      const module = await import("./entries.js");
      const loadedEntries = module.default;
      setEntriesList(loadedEntries);
      const initialEntry = loadedEntries[Math.floor(Math.random() * loadedEntries.length)];
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

  const onEnter = async () => {
    const typed = current.trim();
    if (!typed) return;

    // Verifica no dicionário se a palavra existe (tolerante a acentos e "ç")
    try {
      let Word = dictRef.current;
      if (!Word) {
        const mod = await import("@andsfonseca/palavras-pt-br");
        try { mod.Word.library = mod.PYTHONPROBR; } catch {}
        Word = mod.Word;
        dictRef.current = Word;
      }

      // 1) Tenta com a palavra digitada (a lib tem flag removeAccents)
      let isValid = Word.checkValid(typed, 0, true, true, false, false);

      // 2) Se falhar, tenta versão normalizada sem acento/cedilha
      if (!isValid) {
        const plain = normalizeForDict(typed);
        isValid = Word.checkValid(plain, 0, true, true, false, false);
      }

      // 3) Último fallback: comparação estrita (sem remover acentos na lib),
      //    pois algumas bases podem guardar a forma acentuada
      if (!isValid) {
        isValid = Word.checkValid(typed, 0, false, true, false, false);
      }

      if (!isValid) {
        showToast("Palavra não existe no dicionário");
        return;
      }
    } catch (err) {
      // Em caso de erro na importação/validação, não bloquear a jogada
      console.error("Falha ao validar no dicionário:", err);
    }

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

  const styles = useMemo(() => getTheme(darkMode), [darkMode]);

  if (!entry) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${styles.pageBg}`}>
        <p className={`text-xl font-semibold ${darkMode ? "text-indigo-200" : "text-indigo-700"}`}>
          Carregando jogo...
        </p>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ dark: darkMode, setDark: setDarkMode }}>
      <div className={`min-h-screen ${styles.pageBg} flex flex-col items-center p-6`}>
        <Header
          onOpenInstructions={() => setShowInstructions(true)}
          onOpenSettings={() => setShowSettings(true)}
        />

        <KanjiCard entry={entry} />

        {/* Grid de tentativas + input */}
        <div className="flex flex-col gap-2 mb-4 w-full max-w-lg">
          <GuessGrid guesses={guesses} evaluations={evaluations} />
          {!gameOver && (
            <GuessInput value={current} onChange={setCurrent} onEnter={onEnter} />
          )}
        </div>

        <Toast message={message} />

        <GameOverModal
          open={gameOver && gameOverModal}
          win={win}
          answer={answer}
          onPlayAgain={() => setEntry(pickRandom(entry.answer))}
          onClose={() => setGameOverModal(false)}
        />

        <InstructionsModal
          open={showInstructions}
          attempts={attempts}
          onClose={() => setShowInstructions(false)}
        />

        <SettingsModal
          open={showSettings}
          dark={darkMode}
          toggleDark={() => setDarkMode((v) => !v)}
          onClose={() => setShowSettings(false)}
        />

        <footer className={`mt-8 text-xs ${styles.subText}`}>Acentos são opcionais • Valido no dicionário PT-BR</footer>
      </div>
    </ThemeContext.Provider>
  );
}
