const model = require('../model/model');

const caseFolding = (text) => text.replace(/[^a-zA-Z ]/g, '').toLowerCase();

const tokenizing = (text) => text.split(' ');

const getKata = async (katadasar) => {
    const kata = await model.kamus.findAll({ where: { katadasar } });
    return kata.length > 0;
};

const inflexionalSuffixes = async (kata) => {
  const suffixes = ['tah', 'lah', 'kah', 'pun'];
  for (const suffix of suffixes) {
    const inflexResult = kata.slice(0, -(suffix.length));
    if (kata.slice(-(suffix.length)) === suffix) {
      const isTrue = await getKata(inflexResult);
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

const pronounSuffixes = async (kata) => {
  const suffixes = ['ku', 'mu', 'nya'];
  for (const suffix of suffixes) {
    const proSuffixes = kata.slice(0, -(suffix.length));
    if (kata.slice(-(suffix.length)) === suffix) {
      const isTrue = await getKata(proSuffixes);
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

const derivationSuffixes = async (kata) => {
  if (kata.slice(-1) === 'i') {
    const isTrue = await getKata(kata.slice(0, -1));
    if (isTrue) return kata.slice(0, -1);
  } else if (kata.slice(-2) == 'an') {
    const isTrue = await getKata(kata.slice(0, -2));
    if (isTrue) {
      return kata.slice(0, -2);
    } else if(kata.slice(-3) == 'kan') {
      const isAnotherTrue = await getKata(kata.slice(0, -3));
      if (isAnotherTrue) return kata.slice(0, -3);
    }
  }
  return kata;
}

const derivationPrefix = async (kata) => {
  const prefixes = ['be', 'di', 'ke', 'me', 'pe', 'se', 'te'];
  for (const prefix of prefixes) {
    const dePrefix = kata.slice(2);
    if (kata.slice(0, 2) === prefix) {
      const isTrue = await getKata(dePrefix);
      if (isTrue) return dePrefix;
    }
  }
  return kata;
}

const stemmingWord = async (kata) => {
  const isTrue = await getKata(kata);
  if (isTrue) return kata;

  const { inflexResult, isInflexTrue } = await inflexionalSuffixes(kata);
  if (isInflexTrue) return inflexResult;

  const { proSuffixes, isPSTrue } = await pronounSuffixes(inflexResult);
  if (isPSTrue) return proSuffixes;

  const deSuffixes = await derivationSuffixes(proSuffixes);
  if (proSuffixes !== deSuffixes) return deSuffixes;

  const dePrefix = await derivationPrefix(proSuffixes);
  if (proSuffixes !== dePrefix) return dePrefix;

  return kata;
}

const stemming = async (data) => {
  return Promise.all(data.map(e => stemmingWord(e)));
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
