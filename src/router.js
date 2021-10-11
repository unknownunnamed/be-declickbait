const controller = require('./controller/controller');

module.exports = (app) => {
  app.route('/')
    .get((req, res) => res.send({
      status: 'success',
      text: 'hello world',
    }));

  app.route('/login')
    .post(controller.adminGetLogin);

  app.route('/berita')
    .post(controller.berita.postBerita);

  app.route('/berita')
    .get(controller.berita.getBerita);

  app.route('/berita/:id')
    .get(controller.berita.getBeritaById);

  app.route('/totalBerita')
    .get(controller.berita.getTotalBerita);

  app.route('/sumberberita')
    .get(controller.berita.getSumberBerita);

  app.route('/berita/:id')
    .put(controller.berita.putBerita);

  app.route('/berita/:id')
    .delete(controller.berita.deleteBerita);

  app.route('/berita')
    .delete(controller.berita.deleteAllBerita);

  app.route('/beritaExcel')
    .post(controller.berita.postBeritaExcel);

  app.route('/train')
    .get(controller.train);

  app.route('/test')
    .get(controller.test);

  app.route('/detection')
    .post(controller.detection);

  app.route('/commons')
    .get(controller.commons);

  app.route('/kata/:id')
    .get(controller.kata);
};
