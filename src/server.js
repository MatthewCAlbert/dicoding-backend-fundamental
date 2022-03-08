require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumValidator,
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
