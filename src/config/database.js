const Sequelize = require('sequelize');

const db = new Sequelize('de_clickbait', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;
