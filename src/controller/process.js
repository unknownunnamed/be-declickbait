const model = require("../model/model");
const { testIDF, testClassification } = require("./test");
const { stemming, tokenizing, caseFolding } = require("./textPreprocessing");
const { tfidfTrain, trainToCommons } = require("./train");

const train = async (req, res) => {
  try {
    model.kata.destroy({
      where: {
        tipekata: "train",
      },
    });
    const dataKata = await model.kamus.findAll();
    const databerita = await model.berita.findAll({
      where: {
        status_data: "train",
      },
    });
    const textProcessing = [];
    for (const berita of databerita) {
      const {
        id,
        judul_berita,
        sumber_berita,
        status_data,
        label,
        label_uji,
        id_admin,
      } = berita;
      const processKata = stemming(tokenizing(caseFolding(judul_berita)), dataKata);
      const data = [...processKata, sumber_berita];
      textProcessing.push({
        id,
        data,
        status_data,
        label,
        label_uji,
        id_admin,
      });
    }
    const tfidf = await tfidfTrain(textProcessing, true);
    const commons = trainToCommons(tfidf);
    await model.commons.update(
      {
        w_total_clickbait: commons.wClickbait,
        w_total_not_clickbait: commons.wNotClickbait,
        w_unik: commons.idf,
        n_clickbait: commons.nClickbait,
        n_not_clickbait: commons.nNotClickbait,
      },
      {
        where: {
          id: 1,
        },
      }
    );
    res.status(200).json({
      status: "success",
      data: commons,
    });
  } catch (err) {
    res.status(400).json({
      status: err.toString(),
    });
  }
};

const test = async (req, res) => {
  try {
    model.kata.destroy({
      where: {
        tipekata: "test",
      },
    });
    const dataKata = await model.kamus.findAll();
    const databerita = await model.berita.findAll({
      where: {
        status_data: "test",
      },
    });
    const wordtrain = await model.kata.findAll({
      where: {
        tipekata: "train",
      },
    });
    const commons = await model.commons.findAll();
    const textProcessing = [];
    for (const berita of databerita) {
      const {
        id,
        judul_berita,
        sumber_berita,
        status_data,
        label,
        label_uji,
        id_admin,
      } = berita;
      const processKata = stemming(tokenizing(caseFolding(judul_berita)), dataKata);
      const data = [...processKata, sumber_berita];
      textProcessing.push({
        id,
        data,
        status_data,
        label,
        label_uji,
        id_admin,
      });
    }

    const testclickbait = [];
    for (const item of textProcessing) {
      const { id, data, status_data, label } = item;
      for (const kata of data) {
        await model.kata.create({
          id_berita: id,
          tipekata: status_data,
          kata,
          TF: data.filter((e) => e === kata).length,
          IDF_clickbait: testIDF(wordtrain, kata, "clickbait"),
          IDF_not_clickbait: testIDF(wordtrain, kata, "not_clickbait"),
          IDF: testIDF(wordtrain, kata, "IDF"),
        });
      }
      const labelTest = testClassification(wordtrain, commons[0], data);
      testclickbait.push({
        id,
        data,
        status_data,
        label,
        label_uji: labelTest,
      });
      await model.berita.update({
        label_uji: labelTest,
      },
      {
        where: {
          id,
        }
      });
    }

    const dataTrue = testclickbait.filter((e) => e.label === e.label_uji);
    const dataTrueClickbait = dataTrue.filter((e) => e.label === "Clickbait");
    const labelClickbait = testclickbait.filter((e) => e.label === "Clickbait");
    const ujiClickbait = testclickbait.filter(
      (e) => e.label_uji === "Clickbait"
    );

    const confusionMatrix = {
      accuracy: dataTrue.length / testclickbait.length,
      recall: dataTrueClickbait.length / labelClickbait.length,
      precisions: dataTrueClickbait.length / ujiClickbait.length,
    };

    const { accuracy, recall, precisions } = confusionMatrix;

    await model.commons.update({
      accuracy,
      recall,
      precisions
    },
    {
      where: {
        id: 1,
      }
    });

    res.status(200).json({
      status: "success test",
      data: confusionMatrix,
    });
  } catch (err) {
    res.status(400).json({
      status: err.toString(),
    });
  }
};

const detection = async (req, res) => {
  try {
    const { title, sumberBerita } = req.body;

    const wordtrain = await model.kata.findAll({
      where: {
        tipekata: "train",
      },
    });

    const commons = await model.commons.findAll();
    const dataKata = await model.kamus.findAll();
    const processKata = stemming(tokenizing(caseFolding(title)), dataKata);
    const data = [...processKata, sumberBerita];

    const detection = testClassification(wordtrain, commons[0], data);

    res.status(200).json({
      status: "success",
      result: detection,
    });
  } catch (err) {
    res.status(400).json({
      status: err.toString(),
    });
  }
};

module.exports = { train, test, detection };
