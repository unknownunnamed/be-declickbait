const model = require('../model/model');

const caseFolding = (text) => text.replace(/[^a-zA-Z ]/g, '')
  .toLowerCase()
  .replace(/\s\s+/g, ' ')
  .trim();

const tokenizing = (text) => text.split(" ");

const getKata = (katadasar, dataKata) => {
  return dataKata.filter((e) => e.katadasar === katadasar).length > 0;
};

const inflexionalSuffixes = (kata, dataKata) => {
  const suffixes = ['tah', 'lah', 'kah', 'pun'];
  for (const suffix of suffixes) {
    const inflexResult = kata.slice(0, -(suffix.length));
    if (kata.slice(-(suffix.length)) === suffix) {
      const isTrue = getKata(inflexResult, dataKata);
      return {
        inflexResult,
        isInflexTrue: isTrue,
      }
    }
  }
  return {
    inflexResult: kata,
    isInflexTrue: false,
  };
};

const pronounSuffixes = (kata, dataKata) => {
  const suffixes = ['ku', 'mu', 'nya'];
  for (const suffix of suffixes) {
    const proSuffixes = kata.slice(0, -(suffix.length));
    if (kata.slice(-(suffix.length)) === suffix) {
      const isTrue = getKata(proSuffixes, dataKata);
      return {
        proSuffixes,
        isPSTrue: isTrue,
      }
    }
  }
  return {
    proSuffixes: kata,
    isPSTrue: false,
  };
};

const derivationSuffixes = (kata, dataKata) => {
  if (kata.slice(-1) === 'i') {
    const isTrue = getKata(kata.slice(0, -1), dataKata);
    if (isTrue) return kata.slice(0, -1);
  } else if (kata.slice(-2) == 'an') {
    const isTrue = getKata(kata.slice(0, -2), dataKata);
    if (isTrue) {
      return kata.slice(0, -2);
    } else if (kata.slice(-3) == 'kan') {
      const isAnotherTrue = getKata(kata.slice(0, -3), dataKata);
      if (isAnotherTrue) return kata.slice(0, -3);
    }
  }
  return kata;
}

const derivationPrefix = (kata, dataKata) => {
  const prefixes = [
    'be',
    'di',
    'ke',
    'me',
    'pe',
    'se',
    'te',
  ];
  let awalan = '';
  let kataBaru = kata;
  for (const prefix of prefixes) {
    if (kataBaru.slice(0, prefix.length) === prefix) {
      awalan = prefix;
      const dePrefix = kataBaru.slice(prefix.length);
      kataBaru = kataBaru.slice(prefix.length);
      const isTrue = getKata(dePrefix, dataKata);
      if (isTrue) {
        return { dePrefix, awalan, isDPTrue: true };
      }
    }
  }
  return { dePrefix: kataBaru, awalan, isDPTrue: false };
}

const cekPrefixDisallowedSufixes = (kata) => {
  if (kata.slice(0, 2) === 'be' && kata.slice(0, -1) === 'i') {
    return true;
  }

  if (kata.slice(0, 2) === 'se' && (kata.slice(0, -1) === 'i' || kata.slice(0, -3) === 'kan')) {
    return true;
  }

  if (kata.slice(0, 2) === 'di' && kata.slice(0, -2) === 'an') {
    return true;
  }

  if (kata.slice(0, 2) === 'me' && kata.slice(0, -2) === 'an') {
    return true;
  }

  if (kata.slice(0, 2) === 'ke' && (kata.slice(0, -1) === 'i' || kata.slice(0, -3) === 'kan')) {
    return true;
  }

  return false;
}

const stemmingWord = (kata, dataKata) => {
  let awalanCheck;
  let kataSementara;
  const isTrue = getKata(kata, dataKata);
  if (isTrue) return kata;


  const { inflexResult, isInflexTrue } = inflexionalSuffixes(kata, dataKata);
  if (isInflexTrue) return inflexResult;

  const { proSuffixes, isPSTrue } = pronounSuffixes(inflexResult, dataKata);
  if (isPSTrue) return proSuffixes;
  kataSementara = proSuffixes;
  let i = 0;
  while (i <= 3) {
    const deSuffixes = derivationSuffixes(kataSementara, dataKata);
    if (kataSementara !== deSuffixes) return deSuffixes;

    const { dePrefix, awalan, isDPTrue } = derivationPrefix(kataSementara, dataKata);
    if (isDPTrue) return dePrefix;
    if (awalanCheck === awalan) return kata;
    awalanCheck = awalan;
    kataSementara = dePrefix;
    if (cekPrefixDisallowedSufixes(kataSementara)) return kata;
    i++;
  }

  return kata;
}

const stemming = (data, dataKata) => {
  return data.map(e => stemmingWord(e, dataKata));
};

module.exports = {
  caseFolding,
  tokenizing,
  stemming,
  getKata,
  inflexionalSuffixes,
  derivationSuffixes,
  pronounSuffixes,
  derivationPrefix,
  cekPrefixDisallowedSufixes,
  stemmingWord
};
