const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
    this.tableName = 'playlist_songs';
  }

  async create({ playlistId, songId }) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteByPlaylistAndSongid({ playlistId, songId }) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu playlist gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsService;
