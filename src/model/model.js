const admin = require('./admin');
const berita = require('./berita');
const kamus = require('./kamus');

const model = {};

model.admin = admin;
model.berita = berita;
model.kamus = kamus;

module.exports = model;
