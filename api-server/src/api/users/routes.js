const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (usersHandler) => [
  {
    method: 'POST',
    path: '/users',
    handler: usersHandler.postHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: usersHandler.getByIdHandler,
  },
].map(routeHandlerMapper);

module.exports = routes;
