const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (collaborationsHandler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: collaborationsHandler.postHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: collaborationsHandler.deleteHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
].map(routeHandlerMapper);

module.exports = routes;
