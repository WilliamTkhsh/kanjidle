export const stripDiacritics = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export const normalizeForDict = (s) =>
  stripDiacritics(s).replace(/ç/g, "c");

export const onlyLetters = (s) =>
  (s.match(/[a-zA-ZçÇáàâãéêíóôõúüÁÀÂÃÉÊÍÓÔÕÚÜ]/g) || []).join("");