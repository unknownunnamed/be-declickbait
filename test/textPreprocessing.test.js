const { 
  caseFolding, 
  tokenizing, 
  stemming, 
  getKata, 
  inflexionalSuffixes,
  derivationSuffixes,
  pronounSuffixes,
  derivationPrefix,
  stemmingWord
} = require('../src/controller/textPreprocessing');
const model = require('../src/model/model');
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('caseFolding', () => {
  test('it should return text only with alphabet without another character', () => {
    const data = 'saya %@#bersama9*(&^';
    expect(caseFolding(data)).toBe('saya bersama');
  });

  test('it should return lowecase text', () => {
    const data = 'Messi Pindah keArsenal';
    expect(caseFolding(data)).toBe('messi pindah kearsenal');
  });
});

describe('tokenizing', () => {
  test('it should return ["messi", "pindah", "kearsenal"] where input text "messi pindah kearsenal"', () => {
    const data = 'messi pindah kearsenal';
    expect(tokenizing(data)).toStrictEqual(['messi', 'pindah', 'kearsenal']);
  });
});

describe('stemming', () => {
  test('it should return true if you input the word root', async () => {
    const kata = await model.kamus.findAll();
    const result = getKata("sekolah", kata);
    expect(result).toBe(true);
  });

  test('it should return word root if the word have inflecitional suffix', async () => {
    const kata = await model.kamus.findAll();
    const result = inflexionalSuffixes("meskipun", kata);
    expect(result).toStrictEqual({ inflexResult: "meski", isInflexTrue: true });
  });

  test('it should return word root if the word have inflectional possessive pronoun suffix', async () => {
    const kata = await model.kamus.findAll();
    const result = pronounSuffixes("punyamu", kata);
    expect(result).toStrictEqual({ proSuffixes: "punya", isPSTrue: true });
  });

  test('it should return word root if the word have derivation suffix', async () => {
    const kata = await model.kamus.findAll();
    const result = derivationSuffixes("punyai", kata);
    expect(result).toBe("punya");
  });
  
  test('it should return word root if the word have derivation suffix', async () => {
    const kata = await model.kamus.findAll();
    const result = derivationSuffixes("punyaan", kata);
    expect(result).toBe("punya");
  });

  test('it should return word root if the word have derivation prefix', async () => {
    const kata = await model.kamus.findAll();
    const result = derivationPrefix("kesini", kata);
    expect(result).toBe("sini");
  });

  test('it should return word root when input word', async () => {
    const kata = await model.kamus.findAll();
     result = stemmingWord("kedengannyalah", kata);
    expect(result).toBe("dengan");
  });

  test('it should return ["meski", "pulang", "ke", "sekolah"] where input array ["meskipun", "pulanglah", "ke", "sekolah"]', async () => {
    const data = ['meskipun', 'pulanglah', 'ke', 'sekolah'];
    const kata = await model.kamus.findAll();
    const result = stemming(data, kata);
    expect(result).toStrictEqual(['meski', 'pulang', 'ke', 'sekolah']);
  });
});

