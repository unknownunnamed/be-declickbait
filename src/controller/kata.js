const model = require("../model/model");

const getKataByIdBerita = (req, res) => {
  model.berita
    .findAll({
      where: {
        id: req.params.id,
      },
      include: {
        model: model.kata,
        as: 'kata',
      }
    })
    .then((result) =>
      res.status(200).json({
        status: "success",
        data: result,
      })
    )
    .catch((error) => res.status(400).json({ status: error.toString() }));
    // model.kata
    // .findAll({
    //   where: {
    //     id_berita: req.params.id,
    //   },
    // })
    // .then((result) =>
    //   res.status(200).json({
    //     status: "success",
    //     data: result,
    //   })
    // )
    // .catch((error) => res.status(400).json({ status: error.toString() }));
};

module.exports = getKataByIdBerita;
