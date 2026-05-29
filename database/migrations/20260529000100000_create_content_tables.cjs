exports.up = (pgm) => {
  pgm.sql(`
    create table if not exists projects (
      id text primary key,
      name text not null,
      mark text not null check (mark in ('diamond', 'triangle', 'circle', 'square')),
      description text not null,
      image_url text not null,
      image_key text,
      github_url text,
      deployment_url text,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists site_profile (
      id text primary key default 'main',
      display_name text not null,
      greeting text not null,
      bio text not null,
      portrait_url text,
      portrait_key text,
      updated_at timestamptz not null default now()
    );

    insert into site_profile (id, display_name, greeting, bio)
    values (
      'main',
      'Gorazd Filipovski',
      'Hello, I''m',
      'Software engineer and designer based in Skopje. I build minimal, considered products at the intersection of craft and code.'
    )
    on conflict (id) do nothing;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    drop table if exists site_profile;
    drop table if exists projects;
  `);
};
