const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const PlaylistSongActivitiesMapper = require('../../mapper/PlaylistSongActivitiesMapper');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
    this.tableName = 'playlist_song_activities';
  }

  async create({
    playlistId, songId, userId, action,
  }) {
    const id = `psa-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO ${this.tableName} VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getByPlaylistId(playlistId) {
    const query = {
      text: `SELECT ${this.tableName}.*, users.username, songs.title FROM ${this.tableName} 
        LEFT JOIN users ON users.id = ${this.tableName}.user_id 
        LEFT JOIN songs ON songs.id = ${this.tableName}.song_id 
        WHERE ${this.tableName}.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return [];
    }

    return result.rows.map(PlaylistSongActivitiesMapper);
  }
}

module.exports = PlaylistSongActivitiesService;
