const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const PlaylistMapper = require('../../mapper/PlaylistMapper');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this.tableName = 'playlists';
    this._collaborationService = collaborationService;
  }

  async create({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAll(owner) {
    const query = {
      text: `SELECT ${this.tableName}.*, users.username FROM ${this.tableName} 
        LEFT JOIN users ON users.id = ${this.tableName}.owner 
        LEFT JOIN collaborations ON collaborations.playlist_id = ${this.tableName}.id 
        WHERE ${this.tableName}.owner = $1 OR collaborations.user_id = $1 `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(PlaylistMapper);
  }

  async getOneById(id, options = {}) {
    const { withSongs = false } = options;
    const query = {
      text: `SELECT ${this.tableName}.*, users.username AS username FROM ${this.tableName} LEFT JOIN users ON users.id = ${this.tableName}.owner WHERE ${this.tableName}.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (withSongs) {
      const query2 = {
        text: 'SELECT * FROM playlist_songs RIGHT JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_id = $1',
        values: [id],
      };
      const result2 = await this._pool.query(query2);
      result.rows[0].songs = result2?.rows;
    }

    return result.rows.map(PlaylistMapper)[0];
  }

  async deleteById(id) {
    const query = {
      text: `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyOwner(id, owner) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyAccess(playlistId, userId) {
    try {
      await this.verifyOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
