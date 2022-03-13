const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this.tableName = 'user_album_likes';
    this._cacheService = cacheService;
  }

  async create({
    userId, albumId,
  }) {
    const id = `ual-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Menyukai album gagal ditambahkan');
    }

    await this._cacheService.delete(`${this.tableName}:${albumId}`);

    return result.rows[0].id;
  }

  async isExistsByUserAndAlbumId({
    userId, albumId,
  }) {
    const query = {
      text: `SELECT id FROM ${this.tableName} WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    return Boolean(result.rows.length);
  }

  async getCountByAlbumId(albumId) {
    try {
      const result = await this._cacheService.get(`${this.tableName}:${albumId}`);
      return result;
    } catch (error) {
      const query = {
        text: `SELECT id FROM ${this.tableName} WHERE album_id = $1`,
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const count = result.rows?.length || 0;

      await this._cacheService.set(`${this.tableName}:${albumId}`, count);

      return count;
    }
  }

  async deleteByUserAndAlbumId({
    userId, albumId,
  }) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE user_id = $1 AND album_id = $2 RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Menyukai album gagal dihapus. Tidak ditemukan');
    }
    await this._cacheService.delete(`${this.tableName}:${albumId}`);
  }
}

module.exports = UserAlbumLikesService;
