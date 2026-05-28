import type { Project } from "../../data/portfolio";

type ProjectsMarqueeProps = {
  projects: Project[];
  onProjectOpen: (project: Project) => void;
};

export function ProjectsMarquee({ projects, onProjectOpen }: ProjectsMarqueeProps) {
  const marqueeProjects = [...projects, ...projects];

  return (
    <section className="projects-block" aria-label="Projects">
      <div className="section-label">
        <span>Projects</span>
        <span>{projects.length.toString().padStart(2, "0")}</span>
      </div>
      <div className="project-marquee">
        <div className="project-track">
          {marqueeProjects.map((project, index) => (
            <button
              className="project-logo"
              key={`${project.name}-${index}`}
              type="button"
              onClick={() => onProjectOpen(project)}
              aria-label={`Open ${project.name}`}
            >
              <span>{project.label}</span>
              <small>{project.name}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
