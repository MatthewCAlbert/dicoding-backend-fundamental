const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { services, validator }) => {
    const albumsHandler = new AlbumsHandler(services, validator);
    server.route(routes(albumsHandler));
  },
};
