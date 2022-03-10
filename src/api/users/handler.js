class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postHandler = this.postHandler.bind(this);
    this.getByIdHandler = this.getByIdHandler.bind(this);
  }

  async postHandler(request) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({ username, password, fullname });

    return {
      code: 201,
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    };
  }

  async getByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
