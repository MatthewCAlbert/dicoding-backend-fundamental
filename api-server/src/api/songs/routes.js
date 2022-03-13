const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (songsHandler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: songsHandler.postHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: songsHandler.getAllHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: songsHandler.getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: songsHandler.putByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: songsHandler.deleteByIdHandler,
  },
].map(routeHandlerMapper);

module.exports = routes;
