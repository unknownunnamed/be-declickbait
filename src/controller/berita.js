const excelToJson = require('convert-excel-to-json');
const del = require('del');
const model = require('../model/model');

const beritaController = {};

const postBeritaExcel = (req, res) => {
  const { data } = req.files;
  const { sumberBerita, idAdmin } = req.body;
  if (data && data.name.split('.').slice(-1)[0] === 'xlsx') {
    data.mv(`./tmp/${data.name}`, async (err) => {
      if (err) {
        res.json({ status: 'error' });
      } else {
        const dataExcel = excelToJson({
          sourceFile: `./tmp/${data.name}`,
          header: { rows: 1 },
          columnToKey: {
            A: 'judul',
            B: 'label',
          },
          sheets: ['Sheet1'],
        });
        await dataExcel.Sheet1
          .slice(0, dataExcel.Sheet1.length * 0.8).map((e) => model.berita.create({
            judul_berita: e.judul,
            sumber_berita: sumberBerita,
            status_data: 'train',
            label: e.label === 'non-clickbait' ? 'Bukan Clickbait' : 'Clickbait',
            id_admin: idAdmin,
          }));
        await dataExcel.Sheet1
          .slice(dataExcel.Sheet1.length * 0.8).map((e) => model.berita.create({
            judul_berita: e.judul,
            sumber_berita: sumberBerita,
            status_data: 'test',
            label: e.label === 'non-clickbait' ? 'Bukan Clickbait' : 'Clickbait',
            id_admin: idAdmin,
          }));
        console.log('success');
        del([`./tmp/${data.name}`]);
        res.json({ status: 'success' });
      }
    });
  } else {
    res.status(400).json({ status: 'error' });
  }
};

const postBerita = (req, res) => {
  const {
    judulBerita, sumberBerita, statusData, label, idAdmin,
  } = req.body;
  if (
    judulBerita !== ''
    || sumberBerita !== ''
    || statusData !== ''
    || label !== ''
    || judulBerita !== null
    || sumberBerita !== null
    || statusData !== null
    || label !== null
  ) {
    model.berita
      .create({
        judul_berita: judulBerita,
        sumber_berita: sumberBerita,
        status_data: statusData,
        label,
        id_admin: idAdmin,
      })
      .then((result) => res.status(200).json({
        status: 'success',
        data: result,
      }))
      .catch((error) => res.status(500).json({ status: error.toString() }));
  } else {
    res.status(400).json({ status: 'error cannot be null' });
  }
};

const getBerita = (req, res) => {
  if (req.query.type) {
    model.berita
      .findAll({
        where: {
          status_data: req.query.type,
        },
      })
      .then((result) => res.status(200).json({
        status: 'success',
        data: result,
      }))
      .catch((error) => res.status(400).json({ status: error.toString() }));
  } else {
    model.berita
      .findAll()
      .then((result) => res.status(200).json({
        status: 'success',
        data: result,
      }))
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
    .then((result) => res.status(200).json({
      status: 'success',
      data: result[0],
    }))
    .catch((error) => res.status(400).json({ status: error.toString() }));
};

const putBerita = (req, res) => {
  const {
    judulBerita, sumberBerita, statusData, label, idAdmin,
  } = req.body;
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
      },
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
              status: 'success',
              data: data[0],
            });
          });
      } else {
        res.status(201).json({
          status: 'error',
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
    .then((result) => res.status(200).json({
      status: 'success',
      data: result,
    }))
    .catch((error) => res.status(500).json({ status: error.toString() }));
};

const deleteAllBerita = (req, res) => {
  model.berita
    .sync({
      force: true,
    })
    .then((result) => res.status(200).json({
      status: 'success',
      data: result,
    }))
    .catch((error) => res.status(500).json({ status: error.toString() }));
};

beritaController.deleteBerita = deleteBerita;
beritaController.putBerita = putBerita;
beritaController.getBeritaById = getBeritaById;
beritaController.postBerita = postBerita;
beritaController.getBerita = getBerita;
beritaController.postBeritaExcel = postBeritaExcel;
beritaController.deleteAllBerita = deleteAllBerita;

module.exports = beritaController;
