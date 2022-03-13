/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    cover: {
      type: 'TEXT',
      notNull: false,
    },
  }, { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.addColumns('albums', ['cover'], { ifExists: true });
};
