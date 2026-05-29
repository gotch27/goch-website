import type { ProjectMark as ProjectMarkType } from "../types/project";

interface ProjectMarkProps {
  mark: ProjectMarkType;
}

export function ProjectMark({ mark }: ProjectMarkProps) {
  return (
    <span className="project-mark" aria-hidden="true">
      <span className={`project-mark__shape project-mark__shape--${mark}`} />
    </span>
  );
}
