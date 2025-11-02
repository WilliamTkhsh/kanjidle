import React, { createContext, useContext } from "react";

export const ThemeContext = createContext({ dark: false, setDark: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const getTheme = (dark) => ({
  // Fundos inspirados em papel washi/sakura no claro e sumi/indigo no escuro
  pageBg: dark
    ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900"
    : "bg-gradient-to-br from-rose-50 via-amber-50 to-stone-100",
  cardBg: dark ? "bg-zinc-900/70 backdrop-blur text-zinc-100" : "bg-white/90 text-stone-900",
  subText: dark ? "text-zinc-300" : "text-stone-600",
  titleText: dark ? "text-rose-300" : "text-rose-700",
  pillBg: dark ? "bg-zinc-700 text-zinc-100" : "bg-rose-100 text-rose-800",
  inputStyle: dark
    ? "border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-rose-400"
    : "border-rose-200 bg-white text-stone-900 focus:ring-rose-500",
  modalBg: dark ? "bg-zinc-900 text-zinc-100" : "bg-white text-stone-900",
  btnPrimary: dark
    ? "bg-rose-500 hover:bg-rose-400 text-white"
    : "bg-rose-600 hover:bg-rose-700 text-white",
  btnSecondary: dark
    ? "bg-zinc-700 hover:bg-zinc-600 text-white"
    : "bg-stone-200 hover:bg-stone-300 text-stone-800",
});
