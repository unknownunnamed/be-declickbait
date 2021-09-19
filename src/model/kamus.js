const Sequelize = require('sequelize');
const db = require('../config/database');

const Kamus = db.define('kamus', {
  katadasar: Sequelize.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Kamus;
