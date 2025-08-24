import React from "react";
import { useTheme } from "../theme";

export default function CurrentRow({ current }) {
  const { dark } = useTheme();
  const base = "w-10 h-12 flex items-center justify-center rounded-lg font-bold text-lg";
  const style = dark ? "bg-slate-700 text-slate-100" : "bg-slate-200 text-slate-900";
  if (!current) return null;
  return (
    <div className="flex justify-center gap-1 flex-wrap">
      {current.split("").map((ch, i) => (
        <div key={i} className={`${base} ${style}`}>{ch.toUpperCase()}</div>
      ))}
    </div>
  );
}