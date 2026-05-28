import { useRef, useState } from "react";
import gochLogo from "./assets/goch.svg";

type Project = {
  name: string;
  label: string;
  summary: string;
  role: string;
  year: string;
  url: string;
};

type ContactLink = {
  name: string;
  url: string;
  icon: "github" | "linkedin" | "email";
};

const projects: Project[] = [
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

const contactLinks: ContactLink[] = [
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

function ContactIcon({ type }: { type: ContactLink["icon"] }) {
  if (type === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.5 0 12.28c0 5.42 3.44 10.02 8.2 11.64.6.11.82-.27.82-.59 0-.29-.01-1.06-.02-2.08-3.34.74-4.04-1.65-4.04-1.65-.55-1.42-1.33-1.8-1.33-1.8-1.09-.76.08-.75.08-.75 1.2.09 1.84 1.27 1.84 1.27 1.07 1.88 2.81 1.34 3.49 1.02.11-.79.42-1.34.76-1.65-2.66-.31-5.46-1.36-5.46-6.07 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.56.12-3.25 0 0 1.01-.33 3.3 1.26A11.2 11.2 0 0 1 12 5.92c1.02.01 2.05.14 3.01.41 2.29-1.59 3.3-1.26 3.3-1.26.65 1.69.24 2.94.12 3.25.77.86 1.23 1.96 1.23 3.3 0 4.72-2.8 5.75-5.47 6.06.43.38.82 1.13.82 2.27 0 1.64-.01 2.96-.01 3.37 0 .33.22.71.82.59A12.3 12.3 0 0 0 24 12.28C24 5.5 18.63 0 12 0Z" />
      </svg>
    );
  }

  if (type === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.44a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.01H3.53V9H7.1v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm10 9.08L3.4 6H2v.48l10 8.23 10-8.23V6h-1.4L12 13.08ZM2 8.88V18h20V8.88l-10 8.23-10-8.23Z" />
    </svg>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openProject(project: Project) {
    setSelectedProject(project);
    dialogRef.current?.showModal();
  }

  function closeProject() {
    dialogRef.current?.close();
    setSelectedProject(null);
  }

  return (
    <main className="portfolio-shell">
      <section className="profile-block" aria-label="Profile">
        <div className="profile-photo" aria-hidden="true">
          <span>GF</span>
        </div>
        <div>
          <p className="eyebrow">Gorazd Filipovski</p>
          <h1>Goch</h1>
        </div>
      </section>

      <section className="description-block" aria-label="Description">
        <p>
          Developer building clean interfaces, local-first tools, and practical
          systems with a sharp focus on usability.
        </p>
      </section>

      <section className="center-logo" aria-label="Logo placeholder">
        <img src={gochLogo} alt="Placeholder handwritten logo" />
        <p>handwritten logo placeholder</p>
      </section>

      <section className="projects-block" aria-label="Projects">
        <div className="section-label">
          <span>Projects</span>
          <span>{projects.length.toString().padStart(2, "0")}</span>
        </div>
        <div className="project-marquee">
          <div className="project-track">
            {[...projects, ...projects].map((project, index) => (
              <button
                className="project-logo"
                key={`${project.name}-${index}`}
                type="button"
                onClick={() => openProject(project)}
                aria-label={`Open ${project.name}`}
              >
                <span>{project.label}</span>
                <small>{project.name}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <nav className="contact-block" aria-label="Contact links">
        <div className="section-label">
          <span>Contact</span>
        </div>
        <div className="contact-links">
          {contactLinks.map((link) => (
            <a
              aria-label={link.name}
              className="contact-link"
              href={link.url}
              key={link.name}
              rel="noopener noreferrer"
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
            >
              <ContactIcon type={link.icon} />
            </a>
          ))}
        </div>
      </nav>

      <dialog
        className="project-dialog"
        ref={dialogRef}
        onCancel={closeProject}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && (
          <div className="dialog-content">
            <button
              aria-label="Close project dialog"
              className="dialog-close"
              type="button"
              onClick={closeProject}
            >
              x
            </button>
            <div className="dialog-logo" aria-hidden="true">
              {selectedProject.label}
            </div>
            <div className="dialog-copy">
              <p className="eyebrow">{selectedProject.year}</p>
              <h2>{selectedProject.name}</h2>
              <p>{selectedProject.summary}</p>
              <dl>
                <div>
                  <dt>Role</dt>
                  <dd>{selectedProject.role}</dd>
                </div>
                <div>
                  <dt>Link</dt>
                  <dd>
                    <a href={selectedProject.url} rel="noopener noreferrer" target="_blank">
                      Open project
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </dialog>
    </main>
  );
}

export default App;
