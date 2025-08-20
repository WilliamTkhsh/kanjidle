import React from "react";
import { onlyLetters } from "../utils/strings";
import { useTheme, getTheme } from "../theme";

export default function GuessInput({ value, onChange, onEnter }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  return (
    <input
      className={`mt-2 w-full border-2 rounded-xl p-3 text-center text-lg focus:outline-none focus:ring-2 ${styles.inputStyle}`}
      value={value}
      onChange={(e) => onChange(onlyLetters(e.target.value))}
      placeholder="Digite sua tentativa"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
};