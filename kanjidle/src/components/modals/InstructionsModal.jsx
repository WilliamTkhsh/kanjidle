import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useTheme, getTheme } from "../../theme";
import { MAX_INPUT_LEN } from "../../utils/strings";

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const Tile = ({ ch, state = "absent", marker = "none" }) => {
  const color =
    state === "correct"
      ? "bg-green-500 text-white"
      : state === "present"
      ? "bg-yellow-500 text-white"
      : "bg-slate-300 text-slate-900";
  const border =
    marker === "longer"
      ? "border-t-4 border-red-500 pt-0.5"
      : marker === "shorter"
      ? "border-b-4 border-sky-300 pb-0.5"
      : "";
  return (
    <div className={`w-9 h-10 rounded-lg font-bold flex items-center justify-center text-sm ${color} ${border}`}>
      {String(ch || "").toUpperCase()}
    </div>
  );
};

const ExampleRow = ({ letters, states = [], marker = "none" }) => (
  <div className="flex gap-1 items-center">
    {letters.map((c, i) => (
      <Tile key={i} ch={c} state={states[i] || "absent"} marker={marker} />
    ))}
  </div>
);

const KeyChip = ({ label, className = "" }) => (
  <kbd className={`px-2 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-semibold ${className}`}>{label}</kbd>
);

const LegendItem = ({ colorClass, text }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-block w-3 h-3 rounded ${colorClass}`} />
    <span className="text-sm">{text}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{children}</h3>
);

const InstructionsModal = ({ open, attempts, maxLen = MAX_INPUT_LEN, onClose }) => {
  const { dark } = useTheme();
  const styles = getTheme(dark);

  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-6 shadow max-w-xl w-full`}>
      <h2 className="text-xl font-bold mb-3">Como jogar</h2>

      {/* OBJETIVO */}
      <div className="space-y-1 mb-4">
        <SectionTitle>Objetivo</SectionTitle>
        <p className={`${styles.subText} text-sm`}>
          Adivinhe a <strong>palavra em português</strong> formada pelos <strong>significados dos kanjis</strong> exibidos.
        </p>
      </div>

      {/* COMO JOGAR */}
      <div className="space-y-2 mb-4">
        <SectionTitle>Como jogar</SectionTitle>
        <ol className={`list-decimal pl-5 space-y-2 ${styles.subText} text-sm`}>
          <li>Use o <strong>teclado na tela</strong> ou o <strong>teclado físico</strong> para digitar (máx. {maxLen} letras).</li>
          <li>Pressione <KeyChip label="Enter" /> para enviar a tentativa ou <KeyChip label="⌫" /> para apagar a última letra.</li>
          <li>A palavra precisa existir no <strong>dicionário de PT-BR</strong>. Se não existir, você verá um aviso.</li>
          <li>Você tem <strong>{attempts}</strong> tentativas por rodada.</li>
          <li>Acentos são <strong>opcionais</strong> (ex.: "cafe" = "café").</li>
        </ol>
      </div>

      {/* CORES / FEEDBACK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <SectionTitle>Cores das letras (tamanho igual)</SectionTitle>
          <div className="flex flex-col gap-2">
            <ExampleRow letters={["c","a","s","a"]} states={["correct","present","absent","absent"]} />
            <div className="grid grid-cols-1 gap-1">
              <LegendItem colorClass="bg-green-500" text={<> <strong>Verde (correto)</strong>: letra certa no lugar certo.</>} />
              <LegendItem colorClass="bg-yellow-500" text={<> <strong>Amarelo (presente)</strong>: letra existe, mas em outro lugar.</>} />
              <LegendItem colorClass="bg-slate-400" text={<> <strong>Cinza (ausente)</strong>: letra não aparece na palavra.</>} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <SectionTitle>Comprimento da palavra</SectionTitle>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs mb-1">Tentativa <strong>maior</strong> que a resposta</p>
              <ExampleRow letters={["f","l","o","r","e","s"]} states={["present","absent","present","absent","absent","absent"]} marker="longer" />
              <p className={`${styles.subText} text-xs mt-1`}>Barra <span className="border-t-4 border-red-500 pt-0.5 inline-block align-middle" style={{width:16}} /> vermelha no topo. Sem verdes; apenas amarelo/cinza.</p>
            </div>
            <div>
              <p className="text-xs mb-1">Tentativa <strong>menor</strong> que a resposta</p>
              <ExampleRow letters={["s","o","l"]} states={["present","absent","absent"]} marker="shorter" />
              <p className={`${styles.subText} text-xs mt-1`}>Barra <span className="border-b-4 border-sky-300 pb-0.5 inline-block align-middle" style={{width:16}} /> azul clara embaixo. Sem verdes; apenas amarelo/cinza.</p>
            </div>
          </div>
        </div>
      </div>

      {/* TECLADO */}
      <div className="space-y-2 mb-4">
        <SectionTitle>Teclado</SectionTitle>
        <p className={`${styles.subText} text-sm`}>
          As teclas mudam de cor conforme o seu progresso. O estado mais forte prevalece (ex.: se ficar verde, não volta a amarelo/cinza).
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Badge className="bg-green-500 text-white">tecla verde = letra correta</Badge>
          <Badge className="bg-yellow-500 text-white">tecla amarela = letra presente</Badge>
          <Badge className="bg-slate-400 text-white">tecla cinza = ausente</Badge>
        </div>
      </div>

      {/* DICAS RÁPIDAS */}
      <div className="space-y-2 mb-6">
        <SectionTitle>Dicas rápidas</SectionTitle>
        <ul className={`list-disc pl-5 space-y-1 ${styles.subText} text-sm`}>
          <li>Comece com palavras comuns e observe as <strong>glossas</strong> de cada kanji.</li>
          <li>Use <em>Enter</em> para testar ideias. Ajuste conforme as cores.</li>
          <li>Lembre-se: o <strong>tamanho</strong> precisa coincidir para habilitar o verde.</li>
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Jogar agora</Button>
      </div>
    </Modal>
  );
};

export default InstructionsModal;