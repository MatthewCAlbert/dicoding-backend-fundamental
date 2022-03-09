const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string().length(22).default(null).allow(null),
}).options({ stripUnknown: true });

const SongQuerySchema = Joi.object({
  title: Joi.string().default(''),
  performer: Joi.string().default(''),
}).options({ stripUnknown: true });

module.exports = { SongPayloadSchema, SongQuerySchema };
