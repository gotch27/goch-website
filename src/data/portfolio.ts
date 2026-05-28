export type ContactIconType = "github" | "linkedin" | "email";

export type Project = {
  name: string;
  label: string;
  summary: string;
  role: string;
  year: string;
  url: string;
};

export type ContactLink = {
  name: string;
  url: string;
  icon: ContactIconType;
};

export const profile = {
  initials: "GF",
  name: "Gorazd Filipovski",
  title: "Goch",
};

export const description =
  "Developer building clean interfaces, local-first tools, and practical systems with a sharp focus on usability.";

export const projects: Project[] = [
  {
    name: "OpenMate",
    label: "OM",
    summary:
      "A clean collaboration app focused on fast matching, useful profiles, and direct workflows.",
    role: "Product engineering, interface design",
    year: "2026",
    url: "https://github.com/GogoPro27",
  },
  {
    name: "Home MCP",
    label: "HM",
    summary:
      "Local automation tooling for making home services and custom assistants easier to connect.",
    role: "Systems, API design",
    year: "2026",
    url: "https://github.com/GogoPro27",
  },
  {
    name: "Goch Website",
    label: "GW",
    summary:
      "A monochrome portfolio surface with project previews, contact links, and a handwritten identity mark.",
    role: "Frontend, visual system",
    year: "2026",
    url: "https://github.com/gotch27/goch-website",
  },
  {
    name: "Codex Apps",
    label: "CA",
    summary:
      "Experiments around app connectors, agent workflows, and small tools that remove repetitive work.",
    role: "Tooling, prototypes",
    year: "2026",
    url: "https://github.com/GogoPro27",
  },
];

export const contactLinks: ContactLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/GogoPro27",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/gorazd-filipovski-5056842b2/",
    icon: "linkedin",
  },
  {
    name: "Email",
    url: "mailto:gorazdfilipovski@gmail.com",
    icon: "email",
  },
];
