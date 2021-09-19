const Sequelize = require('sequelize');
const db = require('../config/database');

const Admin = db.define('admin', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Admin;
