/* eslint-disable camelcase */

const PlaylistMapper = ({
  id,
  name,
  username,
  songs = null,
}) => ({
  id,
  name,
  username,
  ...(songs && ({
    songs: songs?.map(({ id: songId, title, performer }) => (
      { id: songId, title, performer }
    )),
  })),
});

module.exports = PlaylistMapper;
