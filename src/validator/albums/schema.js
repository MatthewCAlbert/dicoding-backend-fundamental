const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
}).options({ stripUnknown: true });

module.exports = { AlbumPayloadSchema };
