const Sequelize = require("sequelize");
const db = require("../config/database");

const Commons = db.define(
  "commons",
  {
    w_total_clickbait: Sequelize.DOUBLE(18, 15),
    w_total_not_clickbait: Sequelize.DOUBLE(18, 15),
    w_unik: Sequelize.DOUBLE(18, 15),
    n_clickbait: Sequelize.DOUBLE(18, 15),
    n_not_clickbait: Sequelize.DOUBLE(18, 15),
    accuracy: Sequelize.DOUBLE(18, 15),
    recall: Sequelize.DOUBLE(18, 15),
    precisions: Sequelize.DOUBLE(18, 15),
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Commons;
