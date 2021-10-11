const { tfidfTrain, isContain, trainToCommons } = require("../src/controller/train");

const dataset = [
    {
        id: 1,
        data: ['success', 'ya', 'kita'],
        label: 'Clickbait',
        status: 'train',
    },
    {
        id: 2,
        data: ['bukan', 'kami', 'mereka'],
        label: 'Clickbait',
        status: 'train',
    },
    {
        id: 3,
        data: ['success', 'kami', 'bukan'],
        label: 'Bukan Clickbait',
        status: 'train',
    },
    {
        id: 4,
        data: ['mereka', 'kita', 'kita'],
        label: 'Bukan Clickbait',
        status: 'train',
    },
    {
        id: 5,
        data: ['bukan', 'bukan', 'kita'],
        label: 'Bukan Clickbait',
        status: 'train',
    },
];

const tfidf = {
    data: [
        {
            kata: 'success',
            idBerita: 1,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'ya',
            idBerita: 1,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0,
            idf: 0.69897000434,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'kita',
            idBerita: 1,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'bukan',
            idBerita: 2,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'kami',
            idBerita: 2,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'mereka',
            idBerita: 2,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Clickbait',
            status: 'train',
        },
        {
            kata: 'success',
            idBerita: 3,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'kami',
            idBerita: 3,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'bukan',
            idBerita: 3,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'mereka',
            idBerita: 4,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.47712125472,
            idf: 0.39794000867,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'kita',
            idBerita: 4,
            tf: 2,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'kita',
            idBerita: 4,
            tf: 2,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'bukan',
            idBerita: 5,
            tf: 2,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'bukan',
            idBerita: 5,
            tf: 2,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
        {
            kata: 'kita',
            idBerita: 5,
            tf: 1,
            idfClickbait: 0.30102999566,
            idfNotClickbait: 0.17609125906,
            idf: 0.22184874962,
            label: 'Bukan Clickbait',
            status: 'train',
        },
    ],
    totalData: 5,
    totalClickbait: 2,
    totalNotClickbait: 3,
}

const commons = {
    nClickbait: 0.4,
    nNotClickbait: 0.6,
    idf: 2.33648752959,
    wClickbait: 1.80617997396,
    wNotClickbait: 3.91338994358,
}

describe('train', () => {
  test('it should return true if the word containing in array', () => {
    const array = ['yes', 'ya', 'oke'];
    const word = 'ya';
    expect(isContain(array, word)).toBe(true);
  })

  test('it should return false if the word not containing in array', () => {
    const array = ['yes', 'ya', 'oke'];
    const word = 'no';
    expect(isContain(array, word)).toBe(false);
  })

  test('it should return the array with value TF and IDF', async () => {
    const result = await tfidfTrain(dataset);
    expect(result).toStrictEqual(tfidf);
  });

  test('it should return value of commons execpt accuracy, recall and precision', () => {
    expect(trainToCommons(tfidf)).toStrictEqual(commons)
  })
});