const shoes = require('./shoesRoutes');
const usersRoutes = require('./userRoutes');

function routerApi(app) {
  app.use('/shoes', shoes);
  app.use('/users', usersRoutes);
}

module.exports = routerApi;
