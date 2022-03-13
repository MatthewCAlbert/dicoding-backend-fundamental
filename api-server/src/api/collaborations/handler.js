class CollaborationsHandler {
  constructor({ collaborationsService, playlistsService, usersService }, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  async postHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyOwner(playlistId, credentialId);
    await this._usersService.getUserById(userId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return {
      code: 201,
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    };
  }

  async deleteHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
