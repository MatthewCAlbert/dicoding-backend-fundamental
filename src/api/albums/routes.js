const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (albumsHandler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: albumsHandler.postHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: albumsHandler.getAllHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumsHandler.getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumsHandler.putByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumsHandler.deleteByIdHandler,
  },
].map(routeHandlerMapper);

module.exports = routes;
