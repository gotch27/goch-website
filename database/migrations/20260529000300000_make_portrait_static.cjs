exports.up = (pgm) => {
  pgm.sql(`
    alter table site_profile
      drop column if exists portrait_url,
      drop column if exists portrait_key;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    alter table site_profile
      add column if not exists portrait_url text,
      add column if not exists portrait_key text;
  `);
};
