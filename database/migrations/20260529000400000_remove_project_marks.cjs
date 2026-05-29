exports.up = (pgm) => {
  pgm.sql(`
    alter table projects
      drop column if exists mark,
      alter column image_url drop not null;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    alter table projects
      add column if not exists mark text not null default 'diamond'
        check (mark in ('diamond', 'triangle', 'circle', 'square')),
      alter column image_url set not null;
  `);
};
