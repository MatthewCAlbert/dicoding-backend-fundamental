const path = require('path');
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
    path: '/albums/covers/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: albumsHandler.postUploadCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
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
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: albumsHandler.getLikeByIdHandler,
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: albumsHandler.postLikeByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
].map(routeHandlerMapper);

module.exports = routes;
