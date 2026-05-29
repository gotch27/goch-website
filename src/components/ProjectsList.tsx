import type { Project } from "../types/project";
import { ProjectMark } from "./ProjectMark";

interface ProjectsListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export function ProjectsList({ projects, onProjectSelect }: ProjectsListProps) {
  return (
    <section className="projects-panel" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-label">
        Projects
      </h2>
      <div className="projects-panel__scroll">
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.id}>
              <button
                type="button"
                className="project-button"
                onClick={() => onProjectSelect(project)}
              >
                <ProjectMark
                  mark={project.mark}
                  logo={project.image}
                  name={project.name}
                />
                <span>{project.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
