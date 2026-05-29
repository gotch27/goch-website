const projects = [
  {
    id: "project-one",
    name: "Project One",
    description: "A minimalist productivity app built with React and TypeScript.",
    imageUrl: "/projects/project-one.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: "https://example.com/",
    sortOrder: 1,
  },
  {
    id: "project-two",
    name: "Project Two",
    description: "An experimental design tool exploring generative layouts.",
    imageUrl: "/projects/project-two.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: "https://example.com/",
    sortOrder: 2,
  },
  {
    id: "project-three",
    name: "Project Three",
    description: "Open-source CLI utility for everyday developer workflows.",
    imageUrl: "/projects/project-three.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: null,
    sortOrder: 3,
  },
  {
    id: "project-four",
    name: "Project Four",
    description: "A clean dashboard experiment for tracking small personal systems.",
    imageUrl: "/projects/project-four.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: "https://example.com/",
    sortOrder: 4,
  },
  {
    id: "project-five",
    name: "Project Five",
    description: "A compact mobile-first tool for collecting ideas and sketches.",
    imageUrl: "/projects/project-five.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: null,
    sortOrder: 5,
  },
  {
    id: "project-six",
    name: "Project Six",
    description: "A visual playground for testing interface motion and layout rhythm.",
    imageUrl: "/projects/project-six.svg",
    githubUrl: null,
    deploymentUrl: "https://example.com/",
    sortOrder: 6,
  },
  {
    id: "project-seven",
    name: "Project Seven",
    description: "A lightweight web app for sharing small curated collections.",
    imageUrl: "/projects/project-seven.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: "https://example.com/",
    sortOrder: 7,
  },
  {
    id: "project-eight",
    name: "Project Eight",
    description: "An experimental developer utility focused on fast local workflows.",
    imageUrl: "/projects/project-eight.svg",
    githubUrl: "https://github.com/",
    deploymentUrl: null,
    sortOrder: 8,
  },
];

exports.up = (pgm) => {
  for (const project of projects) {
    pgm.sql(`
      insert into projects (
        id, name, description, image_url, github_url, deployment_url, sort_order
      )
      values (
        ${toSqlValue(project.id)},
        ${toSqlValue(project.name)},
        ${toSqlValue(project.description)},
        ${toSqlValue(project.imageUrl)},
        ${toSqlValue(project.githubUrl)},
        ${toSqlValue(project.deploymentUrl)},
        ${project.sortOrder}
      )
      on conflict (id) do nothing;
    `);
  }
};

exports.down = (pgm) => {
  pgm.sql(`
    delete from projects
    where id in (${projects.map((project) => toSqlValue(project.id)).join(", ")});
  `);
};

function toSqlValue(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}
