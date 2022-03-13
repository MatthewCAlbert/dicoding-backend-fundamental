class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
  }

  async postHandler(request) {
    const { id } = request.params;
    this._validator.validateExportPlaylistSongsPayload(request.payload);

    const message = {
      playlistId: id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    return {
      code: 201,
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    };
  }
}

module.exports = ExportsHandler;
