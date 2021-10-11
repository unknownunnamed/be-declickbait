const model = require("../model/model");

const getCommons = async (req, res) => {
  model.commons
    .findAll()
    .then((result) =>
      res.status(200).json({
        status: "success",
        data: result[0],
      })
    )
    .catch((error) => res.status(400).json({ status: error.toString() }));
};

module.exports = getCommons;