/* eslint-disable camelcase */

const AlbumMapper = ({
  id,
  name,
  year,
  created_at,
  updated_at,
  songs = null,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

module.exports = AlbumMapper;
