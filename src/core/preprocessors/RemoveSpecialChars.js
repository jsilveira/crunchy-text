// asdsad
import InputPreprocessor from "./InputPreprocessor.js";

const cleanupRegexes = [
  [new RegExp("[àáâãäå]", 'g'), "a"],
  [new RegExp("æ", 'g'), "ae"],
  [new RegExp("ç", 'g'), "c"],
  [new RegExp("[èéêë]", 'g'), "e"],
  [new RegExp("[ìíîï]", 'g'), "i"],
  [new RegExp("ñ", 'g'), "n"],
  [new RegExp("[òóôõö]", 'g'), "o"],
  [new RegExp("œ", 'g'), "oe"],
  [new RegExp("[ùúûü]", 'g'), "u"],
  [new RegExp("[ýÿ]", 'g'), "y"]
]


const specialCharsregex = /[\u0300-\u036f]/g;

function removeDiacriticsCasero(s) {
  if (s) {
    return s.normalize("NFD").replace(specialCharsregex, '').toLowerCase();
  }
  return s;
}


export default class RemoveSpecialChars extends InputPreprocessor {
  constructor(config) {
    super("Remove special chars", config)
  }

  syncProcess(input) {
    return removeDiacriticsCasero((input || "")).trim()
  }
}
