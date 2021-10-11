const testIDF = (tfidf, word, dataClass) => {
  if (tfidf.some((e) => e.kata === word))
    return tfidf.filter((e) => e.kata === word)[0][
      dataClass === "IDF" ? dataClass : `IDF_${dataClass}`
    ];
  return 0;
};

const testTFIDF = (tfidf, title, word, dataClass) => {
  return (
    title.filter((e) => e === word).length * testIDF(tfidf, word, dataClass)
  );
};

const testProbabilitas = (tfidf, commons, title, word, dataClass) => {
  return (
    (testTFIDF(tfidf, title, word, dataClass) + 1) /
    (commons[`w_total_${dataClass}`] + commons.w_unik)
  );
};

const testClassification = (tfidf, commons, data) => {
  const valueClickbait = data.reduce(
    (total, value) =>
      total * testProbabilitas(tfidf, commons, data, value, "clickbait"),
    commons.n_clickbait
  );
  const valueNotClickbait = data.reduce(
    (total, value) =>
      total * testProbabilitas(tfidf, commons, data, value, "not_clickbait"),
    commons.n_not_clickbait
  );
  return valueClickbait > valueNotClickbait ? "Clickbait" : "Bukan Clickbait";
};

module.exports = { testIDF, testTFIDF, testProbabilitas, testClassification };
