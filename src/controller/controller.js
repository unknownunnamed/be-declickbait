const adminGetLogin = require('./admin');
const beritaController = require('./berita');
const getCommons = require('./commons');
const getKataByIdBerita = require('./kata');
const { train, test, detection } = require('./process');

const controller = {};

controller.adminGetLogin = adminGetLogin;
controller.berita = beritaController;
controller.train = train;
controller.test = test;
controller.detection = detection;
controller.commons =  getCommons;
controller.kata = getKataByIdBerita;

module.exports = controller;
