const excelToJson = require("convert-excel-to-json");
const del = require("del");
const Sequelize = require("sequelize");
const model = require("../model/model");
const writeXlsxFile = require('write-excel-file/node');

const beritaController = {};

const postBeritaExcel = (req, res) => {
  const { data } = req.files;
  const { idAdmin } = req.body;
  if (data && data.name.split(".").slice(-1)[0] === "xlsx") {
    data.mv(`./tmp/${data.name}`, async (err) => {
      if (err) {
        res.json({ status: "error" });
      } else {
        const dataExcel = excelToJson({
          sourceFile: `./tmp/${data.name}`,
          header: { rows: 1 },
          columnToKey: {
            B: "judul",
            D: "sumber",
            F: "label",
            G: "statusData"
          },
          sheets: ["Sheet1"],
        });
        // await dataExcel.Sheet1.slice(0, dataExcel.Sheet1.length * 0.8).map(
        //   (e) =>
        //     model.berita.create({
        //       judul_berita: e.judul,
        //       sumber_berita: sumberBerita,
        //       status_data: "train",
        //       label:
        //         e.label === "non-clickbait" ? "Bukan Clickbait" : "Clickbait",
        //       id_admin: idAdmin,
        //     })
        // );
        // await dataExcel.Sheet1.slice(dataExcel.Sheet1.length * 0.8).map((e) =>
        //   model.berita.create({
        //     judul_berita: e.judul,
        //     sumber_berita: sumberBerita,
        //     status_data: "test",
        //     label:
        //       e.label === "non-clickbait" ? "Bukan Clickbait" : "Clickbait",
        //     id_admin: idAdmin,
        //   })
        // );
        Promise.all(
          dataExcel.Sheet1.map((e) =>
            model.berita.create({
              judul_berita: e.judul,
              sumber_berita: e.sumber,
              status_data: e.statusData,
              label:
                e.label,
              id_admin: idAdmin,
            })
          )
        );
        console.log("success");
        del([`./tmp/${data.name}`]);
        res.json({ status: "success" });
      }
    });
  } else {
    res.status(400).json({ status: "error" });
  }
};

const postBerita = (req, res) => {
  const { judulBerita, sumberBerita, statusData, label, idAdmin } = req.body;
  if (
    judulBerita !== "" ||
    sumberBerita !== "" ||
    statusData !== "" ||
    label !== "" ||
    judulBerita !== null ||
    sumberBerita !== null ||
    statusData !== null ||
    label !== null
  ) {
    model.berita
      .create({
        judul_berita: judulBerita,
        sumber_berita: sumberBerita,
        status_data: statusData,
        label,
        id_admin: idAdmin,
      })
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: result,
        })
      )
      .catch((error) => res.status(500).json({ status: error.toString() }));
  } else {
    res.status(400).json({ status: "error cannot be null" });
  }
};

const getBerita = (req, res) => {
  if (req.query.type) {
    model.berita
      .findAll({
        where: {
          status_data: req.query.type,
        },
        attributes: {
          include: [
            [
              Sequelize.fn("count", Sequelize.col("kata.id_berita")),
              "kataCount",
            ],
          ],
        },
        include: { model: model.kata, attributes: [], as: "kata" },
        group: ["berita.id"],
      })
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: result,
        })
      )
      .catch((error) => res.status(400).json({ status: error.toString() }));
  } else {
    model.berita
      .findAll()
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: result,
        })
      )
      .catch((error) => res.status(400).json({ status: error.toString() }));
  }
};

const getBeritaById = (req, res) => {
  model.berita
    .findAll({
      where: {
        id: req.params.id,
      },
    })
    .then((result) =>
      res.status(200).json({
        status: "success",
        data: result[0],
      })
    )
    .catch((error) => res.status(400).json({ status: error.toString() }));
};

const getTotalBerita = (req, res) => {
  if (req.query.type) {
    model.berita
      .count({
        where: {
          status_data: req.query.type,
        },
      })
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: result,
        })
      )
      .catch((error) => res.status(400).json({ status: error.toString() }));
  } else {
    model.berita
      .count()
      .then((result) =>
        res.status(200).json({
          status: "success",
          data: result,
        })
      )
      .catch((error) => res.status(400).json({ status: error.toString() }));
  }
};

const getSumberBerita = async (req, res) => {
  try {
    const sumberBerita = [];
    const berita = await model.berita.findAll();
    berita.forEach((element) => {
      if (!sumberBerita.includes(element.sumber_berita))
        sumberBerita.push(element.sumber_berita);
    });
    res.status(200).json({ status: "success", data: sumberBerita });
  } catch (err) {
    res.status(200).json({ status: err.toString(), data: [] });
  }
};

const putBerita = (req, res) => {
  const { judulBerita, sumberBerita, statusData, label, idAdmin } = req.body;
  model.berita
    .update(
      {
        judul_berita: judulBerita,
        sumber_berita: sumberBerita,
        status_data: statusData,
        label,
        id_admin: idAdmin,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    .then((result) => {
      if (result[0] === 1) {
        model.berita
          .findAll({
            where: {
              id: req.params.id,
            },
          })
          .then((data) => {
            res.status(200).json({
              status: "success",
              data: data[0],
            });
          });
      } else {
        res.status(201).json({
          status: "error",
        });
      }
    })
    .catch((error) => res.status(500).json({ status: error.toString() }));
};

const deleteBerita = (req, res) => {
  model.berita
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((result) =>
      res.status(200).json({
        status: "success",
        data: result,
      })
    )
    .catch((error) => res.status(500).json({ status: error.toString() }));
};

const deleteAllBerita = (req, res) => {
  model.berita
    .destroy({
      where: {},
    })
    .then((result) =>
      res.status(200).json({
        status: "success",
        data: result,
      })
    )
    .catch((error) => res.status(500).json({ status: error.toString() }));
};

const getExcelBerita = async (req, res) => {
  try {
    const schemaPelatihan = [
      {
        column: 'No',
        type: Number,
        value: data => data.no,
      },
      {
        column: 'Judul',
        type: String,
        value: data => data.judul_berita,
      },
      {
        column: 'Sumber',
        type: String,
        value: data => data.sumber_berita,
      },
      {
        column: 'Label',
        type: String,
        value: data => data.label,
      }
    ];

    const schema = [
      {
        column: 'No',
        type: Number,
        value: data => data.no,
      },
      {
        column: 'Judul',
        type: String,
        value: data => data.judul_berita,
      },
      {
        column: 'Sumber',
        type: String,
        value: data => data.sumber_berita,
      },
      {
        column: 'Label',
        type: String,
        value: data => data.label,
      },
      {
        column: 'Hasil Klasifikasi',
        type: String,
        value: data => data.label_uji,
      },
    ];

    const beritas = await model.berita.findAll();
    const train = beritas.filter(berita => berita.status_data === 'train').map((t, index) => {
      return {
        no: index + 1,
        judul_berita: t.judul_berita,
        sumber_berita: t.sumber_berita,
        label: t.label,
        label_uji: t.label_uji,
      }
    });
    const test = beritas.filter(berita => berita.status_data === 'test').map((t, index) => {
      return {
        no: index + 1,
        judul_berita: t.judul_berita,
        sumber_berita: t.sumber_berita,
        label: t.label,
        label_uji: t.label_uji,
      }
    });
    const excelTrain = await writeXlsxFile(train, {
      schema,
      filePath: '/dataTrain.xlsx'
    });
    const excelTest = await writeXlsxFile(test, {
      schema,
      filePath: '/dataTest.xlsx'
    });
    console.log(excelTest);
    console.log(excelTrain);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ status: `error : ${error}` });
  }
}

beritaController.deleteBerita = deleteBerita;
beritaController.putBerita = putBerita;
beritaController.getBeritaById = getBeritaById;
beritaController.postBerita = postBerita;
beritaController.getBerita = getBerita;
beritaController.postBeritaExcel = postBeritaExcel;
beritaController.deleteAllBerita = deleteAllBerita;
beritaController.getSumberBerita = getSumberBerita;
beritaController.getTotalBerita = getTotalBerita;
beritaController.getExcelBerita = getExcelBerita;

module.exports = beritaController;
