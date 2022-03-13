class ExportsHandler {
  constructor(services, validator) {
    const { producerService, playlistsService } = services;
    this._service = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
  }

  async postHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const message = {
      playlistId: id,
      targetEmail: request.payload.targetEmail,
    };

    await this._playlistsService.verifyOwner(id, credentialId);

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    return {
      code: 201,
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    };
  }
}

module.exports = ExportsHandler;
