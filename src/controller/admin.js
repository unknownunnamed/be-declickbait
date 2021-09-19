const model = require('../model/model');

const adminGetLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username !== '' || password !== '' || username !== null || password !== null) {
    model.admin
      .findAll({
        where: {
          username,
          password,
        },
      })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({
            status: 'success',
            data: result[0],
          });
        } else {
          res.status(201).json({
            status: 'error, username atau password salah',
          });
        }
      });
  } else {
    res.status(400).json({
      status: 'error, username atau password tidak boleh kosong',
    });
  }
};

module.exports = adminGetLogin;
