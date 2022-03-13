/* eslint-disable camelcase */

const AlbumMapper = ({
  id,
  name,
  year,
  coverUrl,
  songs = null,
}) => ({
  id,
  name,
  year,
  coverUrl: coverUrl || null,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

module.exports = AlbumMapper;
