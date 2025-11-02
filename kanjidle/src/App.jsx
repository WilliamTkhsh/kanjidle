import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import KanjiCard from "./components/KanjiCard";
import GuessGrid from "./components/GuessGrid";
import CurrentRow from "./components/CurrentRow";
import Keyboard from "./components/Keyboard";
import Toast from "./components/Toast";
import GameOverModal from "./components/modals/GameOverModal";
import WinShareModal from "./components/modals/WinShareModal";
import InstructionsModal from "./components/modals/InstructionsModal";
import SettingsModal from "./components/modals/SettingsModal";
import { ThemeContext, getTheme } from "./theme";
import { scoreGuess } from "./utils/scoreGuess";
import { stripDiacritics, isPtLetter, MAX_INPUT_LEN } from "./utils/strings";
import { isValidWord, warmupSpell } from "./utils/spell.js";
import { pickDailyIndex, todayYMD } from "./utils/daily";
import { loadAttempts, saveAttempts, loadState, saveState } from "./utils/dayStorage";

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
  const [lastInputType, setLastInputType] = useState(null); // 'char' | 'backspace' | 'enter'
  const [winShareOpen, setWinShareOpen] = useState(false);
  const [shareText, setShareText] = useState("");
  const [shareAttempts, setShareAttempts] = useState(0);

  // UI
  const [showInstructions, setShowInstructions] = useState(() => {
    try {
      return !localStorage.getItem("kanjidle_seen_instructions");
    } catch {
      return true; // fallback: considera iniciante
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [today, setToday] = useState(() => todayYMD("America/Sao_Paulo"));
  const GAME_EPOCH = "2025-01-01";
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

      // Índice determinístico do dia (estilo Wordle/Termo)
      const idx = pickDailyIndex(loadedEntries.length, {
        epochYMD: GAME_EPOCH,
        tz: "America/Sao_Paulo",
        offset: 0, // se quiser "pular" dias manualmente
      });
      const chosen = loadedEntries[idx];
      setEntry(chosen);
      setToday(todayYMD("America/Sao_Paulo"));

      // Restaura tentativas do dia (se houver) e reavalia
      try {
        const day = todayYMD("America/Sao_Paulo");
        const prev = loadAttempts(day);
        const persisted = loadState(day);
        if (prev.length > 0) {
          setGuesses(prev);
          setAnswer(chosen.answer);
          const evals = prev.map(g => scoreGuess(g, chosen.answer));
          setEvaluations(evals);
          const won = prev.some(g => stripDiacritics(g) === stripDiacritics(chosen.answer));
          const finished = won || prev.length >= attempts;
          if (finished) {
            setWin(won);
            setGameOver(true);
            setGameOverModal(!won);
            if (won || persisted.win) {
              try {
                const [y, m, d] = day.split("-");
                const dateBR = `${d}/${m}/${y}`;
                const used = prev.length;
                const mapCell = (st) => st === 'correct' ? '🟩' : (st === 'present' ? '🟨' : '⬛');
                const grid = evals.map((row) => row.map(mapCell).join("")).join("\n");
                const text = `Joguei Kanjidle em ${dateBR} e consegui em ${used} tentativa${used === 1 ? '' : 's'}.\n\n${grid}\n✅`;
                setShareText(text);
                setShareAttempts(used);
              } catch {}
              setWinShareOpen(true);
            }
          }
        } else {
          // zerar estado se não há nada salvo
          setAnswer(chosen.answer);
          setGuesses([]);
          setEvaluations([]);
          setCurrent("");
          setGameOver(false);
          setGameOverModal(false);
          setWin(false);
          setMessage("");
        }
      } catch {
        // fallback em caso de erro de localStorage
      }
    };

    loadEntries();
  }, []);

/*
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
*/

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
    setLastInputType('enter');

    // >>> NOVO: persiste tentativas do dia
    try { saveAttempts(today, newGuesses); } catch {}

    const won = stripDiacritics(typed) === stripDiacritics(answer);
    const finished = won || newGuesses.length >= attempts;
    if (won) {
      setWin(true);
      setGameOver(true);
      setGameOverModal(false);
      showToast("Acertou!");
      try { saveState(today, { win: true }); } catch {}
      try {
        const dateYMD = todayYMD("America/Sao_Paulo");
        const [y, m, d] = dateYMD.split("-");
        const dateBR = `${d}/${m}/${y}`;
        const used = newGuesses.length;
        const mapCell = (st) => st === 'correct' ? '🟩' : (st === 'present' ? '🟨' : '⬛');
        const grid = newEvals.map((row) => row.map(mapCell).join("")).join("\n");
        const text = `Joguei Kanjidle em ${dateBR} e consegui em ${used} tentativa${used === 1 ? '' : 's'}.\n\n${grid}\n✅`;
        setShareText(text);
      } catch {}
      setTimeout(() => setWinShareOpen(true), 1000);
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
        setLastInputType('enter');
        onEnter();
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        setLastInputType('backspace');
        setCurrent((prev) => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1 && isPtLetter(e.key)) {
        setLastInputType('char');
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
          {!gameOver && <CurrentRow current={current} lastInputType={lastInputType} />}
        </div>

        <div className="mt-4 w-full max-w-lg">
          <Keyboard
            guesses={guesses}
            evaluations={evaluations}
            onChar={(ch) => { setLastInputType('char'); setCurrent((prev) => prev + ch); }}
            onEnter={() => { setLastInputType('enter'); onEnter(); }}
            onBackspace={() => { setLastInputType('backspace'); setCurrent((prev) => prev.slice(0, -1)); }}
            disabled={gameOver}
            currentLen={current.length}
            maxLen={MAX_INPUT_LEN}
            totalAttempts={attempts}            
          />
        </div>

        <Toast message={message} />

        <GameOverModal
          open={gameOver && gameOverModal}
          win={win}
          answer={answer}
          onPlayAgain={() => setGameOverModal(false)}
          onClose={() => setGameOverModal(false)}
        />

        <WinShareModal
          open={winShareOpen}
          attempts={shareAttempts}
          date={today}
          gridText={shareText}
          onClose={() => setWinShareOpen(false)}
        />

        <InstructionsModal
          open={showInstructions}
          onClose={() => {
            try { localStorage.setItem("kanjidle_seen_instructions", "1"); } catch {}
            setShowInstructions(false);
          }}
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
