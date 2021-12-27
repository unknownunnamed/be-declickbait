const model = require("../model/model");

const isContain = (array, kata) => {
  return array.filter((e) => e === kata).length > 0 ? true : false;
};

const tfidfTrain = async (data, isNotTest) => {
  const tfidf = [];
  const dataClickbait = data.filter((e) => e.label === "Clickbait");
  const dataNotClickbait = data.filter((e) => e.label === "Bukan Clickbait");
  for (const item of data) {
    const { label, id } = item;
    for (const kata of item.data) {
      const lengthClickbait = dataClickbait.filter((e) =>
        isContain(e.data, kata)
      ).length;
      const lengthNotClickbait = dataNotClickbait.filter((e) =>
        isContain(e.data, kata)
      ).length;
      const length = data.filter((e) => isContain(e.data, kata)).length;

      const tf = item.data.filter((e) => e === kata).length;
      const idfClickbait =
        lengthClickbait > 0
          ? parseFloat(
              Math.log10(dataClickbait.length / lengthClickbait).toFixed(11)
            )
          : 0;
      const idfNotClickbait =
        lengthNotClickbait > 0
          ? parseFloat(
              Math.log10(dataNotClickbait.length / lengthNotClickbait).toFixed(
                11
              )
            )
          : 0;
      const idf =
        length > 0
          ? parseFloat(Math.log10(data.length / length).toFixed(11))
          : 0;

      tfidf.push({
        kata,
        idBerita: id,
        tf,
        idfClickbait,
        idfNotClickbait,
        idf,
        label,
      });

      if (isNotTest)
        await model.kata.create({
          id_berita: id,
          tipekata: "train",
          kata,
          TF: tf,
          IDF_clickbait: idfClickbait,
          IDF_not_clickbait: idfNotClickbait,
          IDF: idf,
        });
    }
  }
  return {
    data: tfidf,
    totalData: data.length,
    totalClickbait: dataClickbait.length,
    totalNotClickbait: dataNotClickbait.length,
  };
};

const trainToCommons = (tfidf) => {
  const unique = [];
  for (const data of tfidf.data) {
    if (unique.length === 0) unique.push(data);
    if (unique.filter((e) => e.kata === data.kata).length <= 0)
      unique.push(data);
  }
  return {
    nClickbait: tfidf.totalClickbait / tfidf.totalData,
    nNotClickbait: tfidf.totalNotClickbait / tfidf.totalData,
    idf: unique.map((e) => e.idf).reduce((total, value) => total + value),
    wClickbait: tfidf.data
      .filter((element) => element.label === "Clickbait")
      .map((e) => e.tf * e.idfClickbait)
      .reduce((total, value) => total + value),
    wNotClickbait: tfidf.data
      .filter((element) => element.label === "Bukan Clickbait")
      .map((e) => e.tf * e.idfNotClickbait)
      .reduce((total, value) => total + value),
  };
};

module.exports = { tfidfTrain, isContain, trainToCommons };
