const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { services, validator }) => {
    const exportsHandler = new ExportsHandler(services, validator);
    server.route(routes(exportsHandler));
  },
};
