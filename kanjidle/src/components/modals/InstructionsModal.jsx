import React from "react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { useTheme, getTheme } from "../../theme";

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
  <div className="flex gap-2 items-center justify-center">
    {letters.map((c, i) => (
      <Tile key={i} ch={c} state={states[i] || "absent"} marker={marker} />
    ))}
  </div>
);

const LegendItem = ({ colorClass, text }) => (
  <div className="flex items-center justify-center gap-2">
    <span className={`inline-block w-3 h-3 rounded ${colorClass}`} />
    <span className="text-sm">{text}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-base md:text-lg font-semibold uppercase tracking-wide text-slate-500 text-center">{children}</h3>
);

const InstructionsModal = ({ open, onClose }) => {
  const { dark } = useTheme();
  const styles = getTheme(dark);

  return (
    <Modal open={open} onClose={onClose} className={`${styles.modalBg} rounded-2xl p-8 shadow max-w-lg w-full text-center max-h-[80vh] overflow-y-auto`}>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Regras do jogo</h1>

      <div className="space-y-2 mb-4">
        <SectionTitle>Exemplo</SectionTitle>
        <span className="text-4xl font-bold">電車</span>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className={`rounded-xl px-3 py-2 text-sm font-medium ${styles.pillBg}`}>
            電 = eletricidade
          </div>
          <div className={`rounded-xl px-3 py-2 text-sm font-medium ${styles.pillBg}`}>
            車 = veículo
          </div>            
        </div>        
      </div>

      {/* Tamanho diferente → NUNCA tem verde */}
      <div className="space-y-2 mb-4">
        <SectionTitle>Tamanho diferente da resposta</SectionTitle>
        <div className="flex flex-col gap-3 items-center">
          <div>
            <p className="text-sm md:text-base mb-1 text-center">Tentativa <strong>maior</strong> que a resposta. Barra <span className="border-t-4 border-red-500 pt-0.5 inline-block align-middle" style={{width:16}} /> vermelha no topo.</p>
            <ExampleRow letters={["f","l","o","r","e","s"]} states={["absent","absent","absent","present","present","absent"]} marker="longer" />
          </div>
          <div>
            <p className="text-sm md:text-base mb-1 text-center">Tentativa <strong>menor</strong> que a resposta. Barra <span className="border-b-4 border-sky-300 pb-0.5 inline-block align-middle" style={{width:16}} /> azul clara embaixo.</p>
            <ExampleRow letters={["m","a","r"]} states={["present","absent","present"]} marker="shorter" />
          </div>
          <p className="text-sm md:text-base mb-1 text-center"><strong>Respostas com tamanho diferente NÃO TERÃO CORES VERDES</strong></p>
        </div>
      </div>

      {/* Tamanho igual → permite verde */}
      <div className="space-y-2 mb-4">
        <SectionTitle>Tamanho igual da resposta</SectionTitle>
        <ExampleRow letters={["t","e","m","a"]} states={["correct","present","present","absent"]} />
        <div className="grid grid-cols-1 gap-2 place-items-center">
          <LegendItem colorClass="bg-green-500" text={<><strong>Verde</strong>: letra certa no lugar certo.</>} />
          <LegendItem colorClass="bg-yellow-500" text={<><strong>Amarelo</strong>: letra existe na palavra, mas em outra posição.</>} />
          <LegendItem colorClass="bg-slate-400" text={<><strong>Cinza</strong>: a letra não aparece na palavra.</>} />
        </div>
      </div>

      {/* Tamanho igual → permite verde */}
      <div className="space-y-2 mb-4">
        <SectionTitle>Resposta Correta</SectionTitle>
        <ExampleRow letters={["t","r","e","m"]} states={["correct","correct","correct","correct"]} />
        <p className="text-sm md:text-base mb-1 text-center">Pois combinando <strong>eletricidade</strong> e <strong>veículo</strong> forma a palavra <strong>TREM</strong> no japonês.</p>
      </div>      

      <div className="flex justify-center mt-6">
        <Button onClick={onClose}>Jogar Agora</Button>
      </div>
    </Modal>
  );
};

export default InstructionsModal;

