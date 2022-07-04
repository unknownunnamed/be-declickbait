const controller = require("./controller/controller");

const express = require("express");
const router = express.Router();

router.post("/login", controller.adminGetLogin);

router.post("/berita", controller.berita.postBerita);

router.get("/berita", controller.berita.getBerita);

router.get("/berita/:id", controller.berita.getBeritaById);

router.get("/totalBerita", controller.berita.getTotalBerita);

router.get("/sumberberita", controller.berita.getSumberBerita);

router.get("/converToExcel", controller.berita.getExcelBerita);

router.put("/berita/:id", controller.berita.putBerita);

router.delete("/berita/:id", controller.berita.deleteBerita);

router.delete("/berita", controller.berita.deleteAllBerita);

router.post("/beritaExcel", controller.berita.postBeritaExcel);

router.get("/train", controller.train);

router.get("/test", controller.test);

router.post("/detection", controller.detection);

router.get("/commons", controller.commons);

router.get("/kata/:id", controller.kata);

module.exports = router;

// module.exports = (app) => {
//   app.route("/login").post(controller.adminGetLogin);

//   app.route("/berita").post(controller.berita.postBerita);

//   app.route("/berita").get(controller.berita.getBerita);

//   app.route("/berita/:id").get(controller.berita.getBeritaById);

//   app.route("/totalBerita").get(controller.berita.getTotalBerita);

//   app.route("/sumberberita").get(controller.berita.getSumberBerita);

//   app.route("/berita/:id").put(controller.berita.putBerita);

//   app.route("/berita/:id").delete(controller.berita.deleteBerita);

//   app.route("/berita").delete(controller.berita.deleteAllBerita);

//   app.route("/beritaExcel").post(controller.berita.postBeritaExcel);

//   app.route("/train").get(controller.train);

//   app.route("/test").get(controller.test);

//   app.route("/detection").post(controller.detection);

//   app.route("/commons").get(controller.commons);

//   app.route("/kata/:id").get(controller.kata);

// };
