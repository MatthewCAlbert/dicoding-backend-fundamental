const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (authenticationsHandler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: authenticationsHandler.postHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authenticationsHandler.putHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authenticationsHandler.deleteHandler,
  },
].map(routeHandlerMapper);

module.exports = routes;
