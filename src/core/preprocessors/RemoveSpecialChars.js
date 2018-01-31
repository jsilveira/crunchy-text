import InputPreprocessor from "./InputPreprocessor";


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


function removeDiacriticsCasero(s) {
  if (s) {
    s = s.toLowerCase();
    cleanupRegexes.forEach(([regex, replace]) => s = s.replace(regex, replace))
  }
  return s;
}


export default class RemoveSpecialChars extends InputPreprocessor {
  constructor() {
    super("Remove special chars")
  }

  syncProcess(input) {
    return removeDiacriticsCasero((input || "")).trim()
  }
}
