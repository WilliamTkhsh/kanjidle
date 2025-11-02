import React, { useState } from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useTheme, getTheme } from "../../theme";

export default function WinShareModal({ open, attempts, date, gridText, onClose }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(gridText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-6 shadow max-w-sm w-full animate-kd-slide-down`}>
      <div className="text-center">
        <div className="text-2xl font-bold mb-1">Parabéns!</div>

        <pre className={`text-sm whitespace-pre-wrap text-left p-3 rounded-xl ${dark ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-900'}`}>{gridText}</pre>

        <div className="flex gap-2 justify-center mt-4">
          <button onClick={copy} className="btn-share px-4 py-2 rounded-2xl shadow font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.19164 15.0189 5.37863 15.0547 5.55989L8.94531 9.44011C8.35463 8.87227 7.53384 8.5 6.625 8.5C4.90114 8.5 3.5 9.90114 3.5 11.625C3.5 13.3489 4.90114 14.75 6.625 14.75C7.53384 14.75 8.35463 14.3777 8.94531 13.8099L15.0547 17.6901C15.0189 17.8714 15 18.0584 15 18.25C15 19.9069 16.3431 21.25 18 21.25C19.6569 21.25 21 19.9069 21 18.25C21 16.5931 19.6569 15.25 18 15.25C17.0912 15.25 16.2704 15.6223 15.6797 16.1901L9.57031 12.3099C9.60609 12.1286 9.625 11.9416 9.625 11.75C9.625 11.5584 9.60609 11.3714 9.57031 11.1901L15.6797 7.30989C16.2704 7.87773 17.0912 8.25 18 8.25Z" fill="#ffffff"/>
            </svg>
            {copied ? 'Copiado!' : 'Compartilhe'}
          </button>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
}
