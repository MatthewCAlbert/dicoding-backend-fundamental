const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AlbumMapper = require('../../mapper/AlbumMapper');

class AlbumService {
  constructor() {
    this._pool = new Pool();
    this.tableName = 'albums';
  }

  async create({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAll() {
    const result = await this._pool.query(`SELECT * FROM ${this.tableName}`);
    return result.rows.map(AlbumMapper);
  }

  async getOneById(id) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const query2 = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };
    const result2 = await this._pool.query(query2);
    result.rows[0].songs = result2?.rows;

    return result.rows.map(AlbumMapper)[0];
  }

  async updateById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this.tableName} SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async updateCoverById(id, coverUrl) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `UPDATE ${this.tableName} SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id`,
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui sampul album. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumService;
