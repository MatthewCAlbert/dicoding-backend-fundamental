class PlaylistsHandler {
  constructor(services, validator) {
    const {
      playlistsService, playlistSongsService, playlistSongActivitiesService, songsService,
    } = services;
    this._service = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._songsService = songsService;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getAllHandler = this.getAllHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
    this.postSongHandler = this.postSongHandler.bind(this);
    this.deleteSongHandler = this.deleteSongHandler.bind(this);
    this.getActivitiesByIdHandler = this.getActivitiesByIdHandler.bind(this);
  }

  async postHandler(request) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.create({ name, owner: credentialId });

    return {
      code: 201,
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    };
  }

  async getAllHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getAll(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAccess(id, credentialId);
    const playlist = await this._service.getOneById(id, { withSongs: true });

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyOwner(id, credentialId);
    await this._service.getOneById(id);
    await this._service.deleteById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAccess(id, credentialId);
    await this._songsService.getOneById(songId);
    await this._playlistSongsService.create({ playlistId: id, songId });
    await this._playlistSongActivitiesService.create({
      playlistId: id, songId, userId: credentialId, action: 'add',
    });

    return {
      code: 201,
      status: 'success',
      message: 'Lagi playlist berhasil ditambahkan',
    };
  }

  async deleteSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAccess(id, credentialId);
    await this._playlistSongsService.deleteByPlaylistAndSongid({ playlistId: id, songId });
    await this._playlistSongActivitiesService.create({
      playlistId: id, songId, userId: credentialId, action: 'delete',
    });

    return {
      status: 'success',
      message: 'Lagu playlist berhasil dihapus',
    };
  }

  async getActivitiesByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAccess(id, credentialId);
    const activities = await this._playlistSongActivitiesService.getByPlaylistId(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
