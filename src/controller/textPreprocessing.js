const model = require('../model/model');

const caseFolding = (text) => text.replace(/[^a-zA-Z ]/g, '').toLowerCase();

const tokenizing = (text) => text.split(' ');

const getKata = (katadasar, dataKata) => {
    // const kata = await model.kamus.findAll({ where: { katadasar } });
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
    const isTrue = getKata(kata.slice(0, -1),  dataKata);
    if (isTrue) return kata.slice(0, -1);
  } else if (kata.slice(-2) == 'an') {
    const isTrue = getKata(kata.slice(0, -2), dataKata);
    if (isTrue) {
      return kata.slice(0, -2);
    } else if(kata.slice(-3) == 'kan') {
      const isAnotherTrue = getKata(kata.slice(0, -3), dataKata);
      if (isAnotherTrue) return kata.slice(0, -3);
    }
  }
  return kata;
}

const derivationPrefix = (kata, dataKata) => {
  const prefixes = ['be', 'di', 'ke', 'me', 'pe', 'se', 'te'];
  for (const prefix of prefixes) {
    const dePrefix = kata.slice(2);
    if (kata.slice(0, 2) === prefix) {
      const isTrue = getKata(dePrefix, dataKata);
      if (isTrue) return dePrefix;
    }
  }
  return kata;
}

const stemmingWord = (kata, dataKata) => {
  const isTrue = getKata(kata, dataKata);
  if (isTrue) return kata;

  const { inflexResult, isInflexTrue } = inflexionalSuffixes(kata, dataKata);
  if (isInflexTrue) return inflexResult;

  const { proSuffixes, isPSTrue } = pronounSuffixes(inflexResult, dataKata);
  if (isPSTrue) return proSuffixes;

  const deSuffixes = derivationSuffixes(proSuffixes, dataKata);
  if (proSuffixes !== deSuffixes) return deSuffixes;

  const dePrefix = derivationPrefix(proSuffixes, dataKata);
  if (proSuffixes !== dePrefix) return dePrefix;

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
  stemmingWord
};
