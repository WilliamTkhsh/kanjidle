const ENTRIES = [
  { 
    kanji: "動物", 
    gloss: ["movimento", "coisa"], 
    onyomi: ["dou", "butsu"], 
    answer: "animal" 
  },
  { 
    kanji: "大学", 
    gloss: ["grande", "aprender"], 
    onyomi: ["dai", "gaku"], 
    answer: "universidade" 
  },
  { 
    kanji: "無理", 
    gloss: ["nenhum", "razão"], 
    onyomi: ["mu", "ri"], 
    answer: "impossível" 
  },
  { 
    kanji: "心配", 
    gloss: ["coração", "partilhar"], 
    onyomi: ["shin", "pai"], 
    answer: "preocupação" 
  },
  { 
    kanji: "天気", 
    gloss: ["céu", "espírito"], 
    onyomi: ["ten", "ki"], 
    answer: "clima" 
  },
  { 
    kanji: "火山", 
    gloss: ["fogo", "montanha"], 
    onyomi: ["ka", "zan"], 
    answer: "vulcão" 
  },
  { 
    kanji: "手紙", 
    gloss: ["mão", "papel"], 
    onyomi: ["te", "gami"], 
    answer: "carta" 
  },
  { 
    kanji: "映画", 
    gloss: ["projetar", "quadro"], 
    onyomi: ["ei", "ga"], 
    answer: "filme" 
  },
  { 
    kanji: "新聞", 
    gloss: ["novo", "escuta"], 
    onyomi: ["shin", "bun"], 
    answer: "jornal" 
  },
  { 
    kanji: "医者", 
    gloss: ["medicina", "pessoa"], 
    onyomi: ["i", "sha"], 
    answer: "médico" 
  },
  { 
    kanji: "経済", 
    gloss: ["passar", "ajustar"], 
    onyomi: ["kei", "zai"], 
    answer: "economia" 
  },
  { 
    kanji: "文化", 
    gloss: ["escrita", "mudança"], 
    onyomi: ["bun", "ka"], 
    answer: "cultura" 
  },
  { 
    kanji: "自然", 
    gloss: ["si mesmo", "assim"], 
    onyomi: ["shi", "zen"], 
    answer: "natureza" 
  },
  { 
    kanji: "電話", 
    gloss: ["eletricidade", "conversa"], 
    onyomi: ["den", "wa"], 
    answer: "telefone" 
  },
  { 
    kanji: "勉強", 
    gloss: ["esforço", "forte"], 
    onyomi: ["ben", "kyou"], 
    answer: "estudo" 
  },
  { 
    kanji: "空港", 
    gloss: ["céu", "porto"], 
    onyomi: ["kuu", "kou"], 
    answer: "aeroporto" 
  },
  { 
    kanji: "家族", 
    gloss: ["casa", "tribo"], 
    onyomi: ["ka", "zoku"], 
    answer: "família" 
  },
  { 
    kanji: "未来", 
    gloss: ["ainda não", "vir"], 
    onyomi: ["mi", "rai"], 
    answer: "futuro" 
  },
  { 
    kanji: "時計", 
    gloss: ["tempo", "medir"], 
    onyomi: ["to", "kei"], 
    answer: "relógio" 
  },
  { 
    kanji: "先生", 
    gloss: ["antes", "nascer"], 
    onyomi: ["sen", "sei"], 
    answer: "professor" 
  },
  { 
    kanji: "野菜", 
    gloss: ["campo", "folhagem"], 
    onyomi: ["ya", "sai"], 
    answer: "verdura"
  },
  { 
    kanji: "言葉", 
    gloss: ["dizer", "folha"], 
    onyomi: ["koto", "ba"], 
    answer: "palavra" 
  },
  { 
    kanji: "安心", 
    gloss: ["barato", "coração"], 
    onyomi: ["an", "shin"], 
    answer: "alívio" 
  },
  { 
    kanji: "意識", 
    gloss: ["ideia", "conhecimento"], 
    onyomi: ["i", "shiki"], 
    answer: "consciência" 
  },      
  { 
    kanji: "現象", 
    gloss: ["aparente", "forma"], 
    onyomi: ["gen", "shou"], 
    answer: "fenômeno" 
  },
  { 
    kanji: "発明", 
    gloss: ["partida", "brilhante"], 
    onyomi: ["hatsu", "mei"], 
    answer: "invenção" 
  },  
  { 
    kanji: "呼吸", 
    gloss: ["exalar", "inalar"], 
    onyomi: ["ko", "kyuu"], 
    answer: "respiração" 
  },
  { 
    kanji: "宇宙", 
    gloss: ["céus", "espaço"], 
    onyomi: ["u", "chuu"], 
    answer: "universo" 
  }, 
  { 
    kanji: "性格", 
    gloss: ["natureza", "status"], 
    onyomi: ["sei", "kaku"], 
    answer: "personalidade" 
  },
  { 
    kanji: "製品", 
    gloss: ["fabricar", "item"], 
    onyomi: ["sei", "hin"], 
    answer: "produto" 
  },
  { 
    kanji: "法律", 
    gloss: ["método", "regra"], 
    onyomi: ["hou", "ritsu"], 
    answer: "legislação" 
  },
  { 
    kanji: "文章", 
    gloss: ["escrito", "capítulo"], 
    onyomi: ["bun", "shou"], 
    answer: "texto" 
  },
  { 
    kanji: "事件", 
    gloss: ["assunto", "ocorrência"], 
    onyomi: ["ji", "ken"], 
    answer: "incidente" 
  },
  { 
    kanji: "競技", 
    gloss: ["competição", "habilidade"], 
    onyomi: ["kyou", "gi"], 
    answer: "esporte" 
  },
  { 
    kanji: "権利", 
    gloss: ["autoridade", "benefício"], 
    onyomi: ["ken", "ri"], 
    answer: "direito" 
  },
  { 
    kanji: "地震", 
    gloss: ["terra", "tremor"], 
    onyomi: ["ji", "shin"], 
    answer: "terremoto" 
  },
  { 
    kanji: "人工", 
    gloss: ["homem", "fazer"], 
    onyomi: ["jin", "kou"], 
    answer: "artificial" 
  },
  { 
    kanji: "技術", 
    gloss: ["técnica", "arte"], 
    onyomi: ["gi", "jutsu"], 
    answer: "tecnologia" 
  },
  { 
    kanji: "夫婦", 
    gloss: ["marido", "esposa"], 
    onyomi: ["fu", "fuu"], 
    answer: "casal" 
  },
  { 
    kanji: "義務", 
    gloss: ["justiça", "tarefa"], 
    onyomi: ["gi", "mu"], 
    answer: "obrigação" 
  },
  { 
    kanji: "恐怖", 
    gloss: ["medo", "temer"], 
    onyomi: ["kyou", "fu"], 
    answer: "pavor" 
  },
  { 
    kanji: "感動", 
    gloss: ["sentimento", "mover"], 
    onyomi: ["kan", "dou"], 
    answer: "emoção" 
  },
  { 
    kanji: "不安", 
    gloss: ["não", "tranquilo"], 
    onyomi: ["fu", "an"], 
    answer: "ansiedade" 
  },
  { 
    kanji: "音楽", 
    gloss: ["som", "divertir"], 
    onyomi: ["on", "gaku"], 
    answer: "música" 
  },
  { 
    kanji: "海岸", 
    gloss: ["mar", "costa"], 
    onyomi: ["kai", "gan"], 
    answer: "praia" 
  },
  { 
    kanji: "教育", 
    gloss: ["ensinar", "criar"], 
    onyomi: ["kyou", "iku"], 
    answer: "educação" 
  },
  { 
    kanji: "文学", 
    gloss: ["escrita", "estudo"], 
    onyomi: ["bun", "gaku"], 
    answer: "literatura" 
  },
  { 
    kanji: "環境", 
    gloss: ["anel", "fronteira"], 
    onyomi: ["kan", "kyou"], 
    answer: "ambiente" 
  },
  { 
    kanji: "原因", 
    gloss: ["origem", "fator"], 
    onyomi: ["gen", "in"], 
    answer: "causa" 
  },
  { 
    kanji: "関係", 
    gloss: ["conexão", "ligação"], 
    onyomi: ["kan", "kei"], 
    answer: "relação" 
  },
  { 
    kanji: "観光", 
    gloss: ["observar", "luz"], 
    onyomi: ["kan", "kou"], 
    answer: "turismo" 
  },
  { 
    kanji: "発見", 
    gloss: ["emitir", "ver"], 
    onyomi: ["hakk", "ken"], 
    answer: "descoberta" 
  },
  { 
    kanji: "影響", 
    gloss: ["sombra", "eco"], 
    onyomi: ["ei", "kyou"], 
    answer: "influência" 
  },
  { 
    kanji: "経験", 
    gloss: ["passar", "provar"], 
    onyomi: ["kei", "ken"], 
    answer: "experiência" 
  },
  { 
    kanji: "重要", 
    gloss: ["pesado", "necessário"], 
    onyomi: ["juu", "you"], 
    answer: "importante" 
  },
  { 
    kanji: "感覚", 
    gloss: ["sentimento", "percepção"], 
    onyomi: ["kan", "kaku"], 
    answer: "sensação" 
  },
  { 
    kanji: "証拠", 
    gloss: ["prova", "indício"], 
    onyomi: ["shou", "ko"], 
    answer: "evidência" 
  },
  { 
    kanji: "資金", 
    gloss: ["recurso", "dinheiro"], 
    onyomi: ["shi", "kin"], 
    answer: "capital" 
  },
  { 
    kanji: "兵器", 
    gloss: ["soldado", "instrumento"], 
    onyomi: ["hei", "ki"], 
    answer: "arma" 
  },
  { 
    kanji: "劇場", 
    gloss: ["drama", "local"], 
    onyomi: ["geki", "jou"], 
    answer: "teatro" 
  },  
];

export default ENTRIES;