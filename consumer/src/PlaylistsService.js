const { Pool } = require('pg');

const PlaylistMapper = ({
  id,
  name,
  songs = null,
}) => ({
  id,
  name,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    this.tableName = 'playlists';
  }

  async getOneById(id) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE ${this.tableName}.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const query2 = {
      text: 'SELECT * FROM playlist_songs RIGHT JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_id = $1',
      values: [id],
    };
    const result2 = await this._pool.query(query2);
    result.rows[0].songs = result2?.rows;

    return result.rows.map(PlaylistMapper)[0];
  }
}

module.exports = PlaylistsService;
