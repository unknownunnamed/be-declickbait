const Sequelize = require('sequelize');
const db = require('../config/database');

const Berita = db.define('berita', {
  judul_berita: Sequelize.STRING,
  sumber_berita: Sequelize.STRING,
  status_data: Sequelize.STRING,
  label: Sequelize.STRING,
  label_uji: Sequelize.STRING,
  id_admin: Sequelize.INTEGER,
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Berita;
