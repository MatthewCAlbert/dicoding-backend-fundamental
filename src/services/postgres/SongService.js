const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const SongMapper = require('../../mapper/SongMapper');

class SongService {
  constructor() {
    this._pool = new Pool();
    this.tableName = 'songs';
  }

  async create({
    title, year, genre, performer, duration = 0, albumId = null,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAll({ title = '', performer = '' }) {
    const query = {
      text: `SELECT id, title, performer FROM ${this.tableName} WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2`,
      values: [`%${title.toLowerCase()}%`, `%${performer.toLowerCase()}%`],
    };
    const result = await this._pool.query(query);
    return result.rows.map(SongMapper);
  }

  async getOneById(id) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(SongMapper)[0];
  }

  async updateById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this.tableName} SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongService;
