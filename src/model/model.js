const admin = require("./admin");
const berita = require("./berita");
const kamus = require("./kamus");
const kata = require("./kata");
const commons = require("./commons");

berita.hasMany(kata, {
  as: "kata",
  foreignKey: "id_berita",
});
kata.belongsTo(berita, {
  foreignKey: 'id_berita',
  as: "berita",
});

const model = {
  admin,
  berita,
  kamus,
  kata,
  commons,
};

module.exports = model;
