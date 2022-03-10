const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (playlistsHandler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: playlistsHandler.postHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: playlistsHandler.getAllHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: playlistsHandler.deleteByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },

  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.getByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.postSongHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: playlistsHandler.deleteSongHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },

  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: playlistsHandler.getActivitiesByIdHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
].map(routeHandlerMapper);

module.exports = routes;
