import React from "react";
import { useTheme } from "../theme";

export default function GuessCell({ ch, state, lenState }) {
  const { dark } = useTheme();
  const base = "w-10 h-12 flex items-center justify-center rounded-lg font-bold text-lg";
  const style =
    state === "correct"
      ? "bg-green-500 text-white"
      : state === "present"
      ? "bg-yellow-500 text-white"
      : dark
      ? "bg-slate-600 text-slate-100"
      : "bg-slate-300 text-slate-900";
  const marker =
    lenState === "longer"
      ? "border-t-4 border-red-500 pt-0.5"
      : lenState === "shorter"
      ? "border-b-4 border-sky-300 pb-0.5"
      : "";
  return <div className={`${base} ${style} ${marker}`}>{ch.toUpperCase()}</div>;
};