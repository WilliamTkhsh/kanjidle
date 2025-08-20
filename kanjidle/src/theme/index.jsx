import React, { createContext, useContext } from "react";

export const ThemeContext = createContext({ dark: false, setDark: () => {} });
export const useTheme = () => useContext(ThemeContext);

export const getTheme = (dark) => ({
  pageBg: dark
    ? "bg-gradient-to-br from-slate-900 to-slate-800"
    : "bg-gradient-to-br from-purple-50 to-indigo-100",
  cardBg: dark ? "bg-slate-900/70 backdrop-blur text-slate-100" : "bg-white",
  subText: dark ? "text-slate-300" : "text-slate-600",
  titleText: dark ? "text-indigo-200" : "text-indigo-700",
  pillBg: dark ? "bg-slate-700 text-slate-100" : "bg-purple-100 text-purple-800",
  inputStyle: dark
    ? "border-slate-600 bg-slate-800 text-slate-100 focus:ring-indigo-400"
    : "border-indigo-300 bg-white text-slate-900 focus:ring-indigo-500",
  modalBg: dark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900",
  btnPrimary: dark
    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
    : "bg-indigo-600 hover:bg-indigo-700 text-white",
  btnSecondary: dark
    ? "bg-slate-600 hover:bg-slate-500 text-white"
    : "bg-slate-200 hover:bg-slate-300 text-slate-800",
});