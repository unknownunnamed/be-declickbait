const Sequelize = require("sequelize");
const db = require("../config/database");
// const Berita = require("./berita");

const Kata = db.define(
  "kata",
  {
    id_berita: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "berita",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    tipekata: {
      type: Sequelize.ENUM("train", "test"),
      allowNull: false,
    },
    kata: Sequelize.STRING,
    TF: Sequelize.INTEGER(2),
    IDF_clickbait: Sequelize.DOUBLE(14, 12),
    IDF_not_clickbait: Sequelize.DOUBLE(14, 12),
    IDF: Sequelize.DOUBLE(14, 12),
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Kata.hasOne(Berita, {
//   foreignKey: 'id_berita',
// });
// Berita.belongsTo(Kata);

module.exports = Kata;
