const adminGetLogin = require('./admin');
const beritaController = require('./berita');

const controller = {};

controller.adminGetLogin = adminGetLogin;
controller.berita = beritaController;

module.exports = controller;
