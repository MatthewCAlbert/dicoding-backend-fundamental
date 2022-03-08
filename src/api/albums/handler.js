class AlbumsHandler {
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
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.create({ name, year });

    return {
      code: 201,
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    };
  }

  async getAllHandler() {
    const albums = await this._service.getAll();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getOneById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.updateById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
