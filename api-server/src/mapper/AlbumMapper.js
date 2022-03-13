/* eslint-disable camelcase */

const AlbumMapper = ({
  id,
  name,
  year,
  cover,
  songs = null,
}) => ({
  id,
  name,
  year,
  coverUrl: cover || null,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

module.exports = AlbumMapper;
