import type { RefObject } from "react";
import type { Project } from "../../data/portfolio";

type ProjectDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  project: Project | null;
  onClose: () => void;
  onClosed: () => void;
};

export function ProjectDialog({ dialogRef, project, onClose, onClosed }: ProjectDialogProps) {
  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      onCancel={onClose}
      onClose={onClosed}
    >
      {project && (
        <div className="dialog-content">
          <button
            aria-label="Close project dialog"
            className="dialog-close"
            type="button"
            onClick={onClose}
          >
            x
          </button>
          <div className="dialog-logo" aria-hidden="true">
            {project.label}
          </div>
          <div className="dialog-copy">
            <p className="eyebrow">{project.year}</p>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Link</dt>
                <dd>
                  <a href={project.url} rel="noopener noreferrer" target="_blank">
                    Open project
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </dialog>
  );
}
