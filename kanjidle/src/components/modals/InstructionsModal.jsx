import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useTheme, getTheme } from "../../theme";

export default function InstructionsModal({ open, attempts, onClose }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-6 shadow max-w-md w-full`}>
      <h2 className="text-xl font-bold mb-2">Como jogar</h2>
      <ol className={`list-decimal pl-5 space-y-2 mb-4 ${styles.subText}`}>
        <li>Observe os kanjis e seus significados individuais (glossas) no topo.</li>
        <li>Digite em <strong>português</strong> a palavra alvo que resulta da combinação desses significados.</li>
        <li>Você tem <strong>{attempts}</strong> tentativas. As cores das letras indicam:
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><span className="inline-block px-2 py-0.5 rounded bg-green-500 text-white">correto</span>: letra certa no lugar certo (somente se o tamanho da tentativa for igual ao da resposta).</li>
            <li><span className="inline-block px-2 py-0.5 rounded bg-yellow-500 text-white">presente</span>: letra existe na palavra, mas em outra posição.</li>
            <li><span className="inline-block px-2 py-0.5 rounded bg-slate-400 text-white">ausente</span>: letra não aparece.</li>
          </ul>
        </li>
        <li>Tamanhos diferentes mostram marcadores: <span className="border-t-4 border-red-500 pt-0.5 inline-block">vermelho em cima</span> se maior; <span className="border-b-4 border-sky-300 pb-0.5 inline-block">azul embaixo</span> se menor.</li>
        <li>Acentos são opcionais ("cafe" = "café").</li>
        <li>Pressione <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-800">Enter</kbd> para enviar a tentativa.</li>
      </ol>
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Entendi</Button>
      </div>
    </Modal>
  );
};