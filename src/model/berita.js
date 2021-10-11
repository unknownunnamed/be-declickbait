const Sequelize = require("sequelize");
const db = require("../config/database");
const Kata = require("./kata");

const Berita = db.define(
  "berita",
  {
    judul_berita: Sequelize.STRING,
    sumber_berita: Sequelize.STRING,
    status_data: {
      type: Sequelize.ENUM("train", "test"),
      allowNull: false,
    },
    label: {
      type: Sequelize.ENUM("Clickbait", "Bukan Clickbait"),
      allowNull: false,
    },
    label_uji: {
      type: Sequelize.ENUM("Clickbait", "Bukan Clickbait"),
      allowNull: true,
    },
    id_admin: Sequelize.INTEGER,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// const Kata = db.define(
//   "kata",
//   {
//     id_berita: Sequelize.INTEGER,
//     tipekata: {
//       type: Sequelize.ENUM("train", "test"),
//       allowNull: false,
//     },
//     kata: Sequelize.STRING,
//     TF: Sequelize.DOUBLE(18, 15),
//     IDF_clickbait: Sequelize.DOUBLE(18, 15),
//     IDF_not_clickbait: Sequelize.DOUBLE(18, 15),
//     IDF: Sequelize.DOUBLE(18, 15),
//   },
//   {
//     freezeTableName: true,
//     timestamps: false,
//   }
// );


module.exports = Berita;
