const express = require('express');
const routes = require('./router');

const app = express();

app.use(
  express.json({
    limit: '20mb',
  }),
);

app.use(
  express.urlencoded({
    limit: '20mb',
    extended: true,
  }),
);

routes(app);

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
