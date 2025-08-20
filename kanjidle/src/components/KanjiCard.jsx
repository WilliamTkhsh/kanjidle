import React from "react";
import { useTheme, getTheme } from "../theme";

export default function KanjiCard({ entry }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  const kanjiClass = "text-6xl font-extrabold text-center";
  return (
    <div className={`${styles.cardBg} rounded-3xl shadow-lg p-6 max-w-lg w-full mb-6`}>
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
          <div key={i} className={`rounded-xl px-3 py-2 text-sm font-medium ${styles.pillBg}`}>
            {entry.kanji[i]} = {g}
          </div>
        ))}
      </div>
    </div>
  );
};