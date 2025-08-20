import React from "react";
import { useTheme, getTheme } from "../../theme";

export const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  const base = variant === "primary" ? styles.btnPrimary : styles.btnSecondary;
  return (
    <button className={`px-3 py-2 rounded-2xl shadow ${base} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const IconButton = ({ title, ariaLabel, onClick, children }) => {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  return (
    <button
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      className={`p-2 rounded-xl shadow ${styles.btnSecondary}`}
    >
      {children}
    </button>
  );
};