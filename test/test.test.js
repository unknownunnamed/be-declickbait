const {
  testIDF,
  testTFIDF,
  testProbabilitas,
  testClassification,
} = require("../src/controller/test");

const tfidf = [
  {
    kata: "success",
    id_berita: 1,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "ya",
    id_berita: 1,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0,
    IDF: 0.69897000434,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "kita",
    id_berita: 1,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "bukan",
    id_berita: 2,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "kami",
    id_berita: 2,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "mereka",
    id_berita: 2,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Clickbait",
    tipekata: "train",
  },
  {
    kata: "success",
    id_berita: 3,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "kami",
    id_berita: 3,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "bukan",
    id_berita: 3,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "mereka",
    id_berita: 4,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.47712125472,
    IDF: 0.39794000867,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "kita",
    id_berita: 4,
    TF: 2,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "kita",
    id_berita: 4,
    TF: 2,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "bukan",
    id_berita: 5,
    TF: 2,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "bukan",
    id_berita: 5,
    TF: 2,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
  {
    kata: "kita",
    id_berita: 5,
    TF: 1,
    IDF_clickbait: 0.30102999566,
    IDF_not_clickbait: 0.17609125906,
    IDF: 0.22184874962,
    label: "Bukan Clickbait",
    tipekata: "train",
  },
];

const commons = {
  n_clickbait: 0.4,
  n_not_clickbait: 0.6,
  w_unik: 2.33648752959,
  w_total_clickbait: 1.80617997396,
  w_total_not_clickbait: 3.91338994358,
};

describe("test", () => {
  test("it should return the value idf not clickbait of the word", () => {
    expect(testIDF(tfidf, "bukan", "not_clickbait")).toBe(0.17609125906);
  });

  test("it should return the value idf clickbait of the word", () => {
    expect(testIDF(tfidf, "ya", "clickbait")).toBe(0.30102999566);
  });

  test("it should return zero if the word is not contain in the data TF-IDF", () => {
    expect(testIDF(tfidf, "sukses", "clickbait")).toBe(0);
  });

  test("it should return the value of TF-IDF the word in the title of news", () => {
    expect(testTFIDF(tfidf, ["bukan", "ya", "ya"], "ya", "clickbait")).toBe(
      2 * 0.30102999566
    );
  });

  test("it should return the value of TF-IDF the word in the title of news", () => {
    expect(
      testTFIDF(tfidf, ["bukan", "bukan", "ya"], "bukan", "not_clickbait")
    ).toBe(2 * 0.17609125906);
  });

  test("it should return the value of Probabilitas the word", () => {
    expect(
      testProbabilitas(
        tfidf,
        commons,
        ["bukan", "bukan", "ya"],
        "bukan",
        "not_clickbait"
      )
    ).toBe(0.21635344435547144);
  });

  test("it should return Clickbait if the value Clickbait is bigger then not Clickbait", () => {
    expect(testClassification(tfidf, commons, ["bukan", "bukan"])).toBe(
      "Clickbait"
    );
  });

  test("it should return Bukan Clickbait if the value Clickbait is smaller then not Clickbait", () => {
    expect(testClassification(tfidf, commons, ["mereka"])).toBe(
      "Bukan Clickbait"
    );
  });
});
