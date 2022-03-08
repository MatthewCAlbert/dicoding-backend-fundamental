const ClientError = require('../exceptions/ClientError');

/**
 * HAPI Handler
 * @callback Handler
 * @param {any} request
 * @returns {Promise<any>}
*/

/**
 * Base Handler Wrapper
 * @param {Handler} handler
 * @returns {function}
 */
const baseHandlerWrapper = (handler) => {
  const fn = async (request, h) => {
    try {
      const result = await handler(request);
      const { code = 200, ...props } = result || {};
      const response = h.response({
        status: 'success',
        ...props,
      });
      response.code(code);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  };

  return fn;
};

const routeHandlerMapper = ({ handler, ...props }) => ({
  ...props,
  handler: baseHandlerWrapper(handler),
});

module.exports = { baseHandlerWrapper, routeHandlerMapper };
