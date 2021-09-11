module.exports = (app) => {
  app.route('/')
    .get((req, res) => res.send({
      status: 'success',
      text: 'hello world',
    }));
};
