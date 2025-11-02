import React from "react";
import { useTheme } from "../theme";

export default function CurrentRow({ current, lastInputType }) {
  const { dark } = useTheme();
  const base = "w-10 h-12 flex items-center justify-center rounded-lg font-bold text-lg";
  const style = dark ? "bg-zinc-700 text-zinc-100" : "bg-stone-200 text-stone-900";
  if (!current) return null;

  const AppearingCell = ({ ch, animate }) => (
    <div className={`${base} ${style} ${animate ? "animate-kd-pop-in" : ""}`}>{ch.toUpperCase()}</div>
  );
  return (
    <div className="flex justify-center gap-1 flex-wrap">
      {current.split("").map((ch, i, arr) => (
        <AppearingCell key={i} ch={ch} animate={lastInputType === 'char' && i === arr.length - 1} />
      ))}
    </div>
  );
}
