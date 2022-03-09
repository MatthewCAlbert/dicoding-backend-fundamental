/* eslint-disable camelcase */

const AlbumMapper = ({
  id,
  name,
  year,
  songs = null,
}) => ({
  id,
  name,
  year,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

module.exports = AlbumMapper;
