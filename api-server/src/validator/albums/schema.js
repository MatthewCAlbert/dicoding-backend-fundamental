const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
}).options({ stripUnknown: true });

const UploadCoverSchema = Joi.object({
  cover: Joi.any().required(),
}).options({ stripUnknown: true });

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = { AlbumPayloadSchema, ImageHeadersSchema, UploadCoverSchema };
