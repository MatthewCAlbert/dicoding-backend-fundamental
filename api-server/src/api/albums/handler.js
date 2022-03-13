class AlbumsHandler {
  constructor(services, validator) {
    const { userAlbumLikesService, albumsService, storageService } = services;
    this._service = albumsService;
    this._userAlbumLikesService = userAlbumLikesService;
    this._storageService = storageService;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getAllHandler = this.getAllHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.putByIdHandler = this.putByIdHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);

    this.getLikeByIdHandler = this.getLikeByIdHandler.bind(this);
    this.postLikeByIdHandler = this.postLikeByIdHandler.bind(this);

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
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

    await this._service.getOneById(id);
    await this._service.updateById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteByIdHandler(request) {
    const { id } = request.params;

    await this._service.getOneById(id);
    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async getLikeByIdHandler(request) {
    const { id } = request.params;

    const { cached, count: likes } = await this._userAlbumLikesService.getCountByAlbumId(id);

    return {
      status: 'success',
      ...(cached ? {
        headers: {
          'X-Data-Source': 'cache',
        },
      } : {}),
      data: {
        likes,
      },
    };
  }

  async postLikeByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.getOneById(id);
    const exist = await this._userAlbumLikesService.isExistsByUserAndAlbumId({
      userId: credentialId, albumId: id,
    });

    if (!exist) {
      await this._userAlbumLikesService.create({
        userId: credentialId, albumId: id,
      });
      return {
        code: 201,
        status: 'success',
        message: 'Album berhasil disukai',
      };
    }

    await this._userAlbumLikesService.deleteByUserAndAlbumId({
      userId: credentialId, albumId: id,
    });
    return {
      code: 201,
      status: 'success',
      message: 'Album berhasil batal disukai',
    };
  }

  async postUploadCoverHandler(request) {
    this._validator.validateUploadCoverPayload(request.payload);
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
    await this._service.updateCoverById(id, url);

    return {
      code: 201,
      status: 'success',
      message: 'Sampul berhasil diunggah',
    };
  }
}

module.exports = AlbumsHandler;
