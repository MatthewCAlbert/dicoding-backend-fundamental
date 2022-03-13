const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (exportsHandler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: exportsHandler.postHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
].map(routeHandlerMapper);

module.exports = routes;
