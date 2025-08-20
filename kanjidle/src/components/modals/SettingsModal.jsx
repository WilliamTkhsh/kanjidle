import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { getTheme } from "../../theme";

export default function SettingsModal({ open, dark, toggleDark, onClose }) {
  const styles = getTheme(dark);
  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-6 shadow max-w-sm w-full`}>
      <h2 className="text-xl font-bold mb-4">Configurações</h2>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-medium">Tema escuro</div>
          <div className={`${styles.subText} text-sm`}>Ativa o modo dark para reduzir o brilho.</div>
        </div>
        <button
          role="switch"
          aria-checked={dark}
          onClick={toggleDark}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${dark ? "bg-indigo-600" : "bg-slate-300"}`}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${dark ? "translate-x-7" : "translate-x-1"}`} />
        </button>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
};