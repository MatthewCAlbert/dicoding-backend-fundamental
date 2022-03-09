class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getAllHandler = this.getAllHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.putByIdHandler = this.putByIdHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
  }

  async postHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.create({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      code: 201,
      status: 'success',
      message: 'Musik berhasil ditambahkan',
      data: {
        songId,
      },
    };
  }

  async getAllHandler(request) {
    this._validator.validateSongQuery(request.query);

    const songs = await this._service.getAll(request.query);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getOneById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.getOneById(id);
    await this._service.updateById(id, request.payload);

    return {
      status: 'success',
      message: 'Musik berhasil diperbarui',
    };
  }

  async deleteByIdHandler(request) {
    const { id } = request.params;

    await this._service.getOneById(id);
    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Musik berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
