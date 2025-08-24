export const MAX_INPUT_LEN = 11;

export const stripDiacritics = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const onlyLetters = (s) =>
  (s.match(/[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]/g) || []).join("");

export const normalizeForDict = (s) => stripDiacritics(s).replace(/ç/g, "c");

export const PT_LETTER_RE = /[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]/;
export const isPtLetter = (ch) => PT_LETTER_RE.test(ch);