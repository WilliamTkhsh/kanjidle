import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useTheme, getTheme } from "../../theme";

export default function GameOverModal({ open, win, answer, onPlayAgain, onClose }) {
  const { dark } = useTheme();
  const styles = getTheme(dark);
  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-6 shadow max-w-sm w-full text-center`}>
      <div className="text-2xl font-bold mb-2">{win ? "Parabéns!" : "Fim de jogo"}</div>
      <div className={`mb-4 ${styles.subText}`}>
        Resposta: <span className="font-semibold text-inherit">{answer.toUpperCase()}</span>
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="primary" onClick={onPlayAgain}>Jogar outra</Button>
        <Button variant="secondary" onClick={onClose}>Fechar</Button>
      </div>
    </Modal>
  );
};