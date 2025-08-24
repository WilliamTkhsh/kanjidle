import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import KanjiCard from "./components/KanjiCard";
import GuessGrid from "./components/GuessGrid";
import CurrentRow from "./components/CurrentRow";
import Keyboard from "./components/Keyboard";
import Toast from "./components/Toast";
import GameOverModal from "./components/modals/GameOverModal";
import InstructionsModal from "./components/modals/InstructionsModal";
import SettingsModal from "./components/modals/SettingsModal";
import { ThemeContext, getTheme } from "./theme";
import { scoreGuess } from "./utils/scoreGuess";
import { stripDiacritics, isPtLetter, MAX_INPUT_LEN } from "./utils/strings";
import { isValidWord, warmupSpell } from "./utils/spell.js";

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

  // UI
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const attempts = 12;

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

    // Pré-aquece a engine de dicionário (nspell + dictionary-pt)
    warmupSpell().catch(() => {});

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

    try {
      const ok = await isValidWord(typed);
      if (!ok) {
        showToast("Palavra não existe no dicionário");
        return;
      }
    } catch (err) {
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

  
    useEffect(() => {
    const handleKey = (e) => {
      if (showInstructions || showSettings || gameOver) return;

      if (e.key === "Enter") {
        e.preventDefault();
        onEnter();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setCurrent((prev) => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1 && isPtLetter(e.key)) {
        setCurrent(prev => prev.length < MAX_INPUT_LEN ? prev + e.key : prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showInstructions, showSettings, gameOver, onEnter]);

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

        <div className="flex flex-col gap-2 mb-4 w-full max-w-lg">
          <GuessGrid guesses={guesses} evaluations={evaluations} />
          {!gameOver && <CurrentRow current={current} />}
        </div>

        <div className="mt-4 w-full max-w-lg">
          <Keyboard
            guesses={guesses}
            evaluations={evaluations}
            onChar={(ch) => setCurrent((prev) => prev + ch)}
            onEnter={onEnter}
            onBackspace={() => setCurrent((prev) => prev.slice(0, -1))}
            disabled={gameOver}
          />
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
