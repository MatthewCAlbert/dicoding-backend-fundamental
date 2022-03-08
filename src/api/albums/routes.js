const { routeHandlerMapper } = require('../../utils/ApiHandler');

const routes = (notesHandler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: notesHandler.postNoteHandler,
  },
  {
    method: 'GET',
    path: '/albums',
    handler: notesHandler.getNotesHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: notesHandler.getNoteByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: notesHandler.putNoteByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: notesHandler.deleteNoteByIdHandler,
  },
].map(routeHandlerMapper);

module.exports = routes;
