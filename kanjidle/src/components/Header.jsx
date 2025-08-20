import React from "react";
import { useTheme, getTheme } from "../theme";
import { IconButton } from "./ui/Button";
import { QuestionIcon, GearIcon } from "./icons";

export default function Header({ onOpenInstructions, onOpenSettings }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  return (
    <header className="w-full max-w-lg flex items-center justify-between mb-6">
      <div className="text-left">
        <h1 className={`text-5xl font-extrabold ${styles.titleText}`}>KANJIDLE</h1>
        <p className={`text-sm ${styles.subText}`}>
          Adivinhe a palavra em português a partir dos significados dos kanjis
        </p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton ariaLabel="Instruções" title="Como jogar" onClick={onOpenInstructions}>
          <QuestionIcon />
        </IconButton>
        <IconButton ariaLabel="Configurações" title="Configurações" onClick={onOpenSettings}>
          <GearIcon />
        </IconButton>
      </div>
    </header>
  );
};