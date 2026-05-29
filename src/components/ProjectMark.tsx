import type { ProjectMark as ProjectMarkType } from "../types/project";

interface ProjectMarkProps {
  mark: ProjectMarkType;
  logo?: string;
  name?: string;
}

export function ProjectMark({ mark, logo, name }: ProjectMarkProps) {
  return (
    <span className="project-mark" aria-hidden="true">
      {logo ? (
        <img src={logo} alt={name ?? ""} className="project-mark__logo" />
      ) : (
        <span className={`project-mark__shape project-mark__shape--${mark}`} />
      )}
    </span>
  );
}
