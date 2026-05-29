export type ProjectMark = "diamond" | "triangle" | "circle" | "square";

export interface Project {
  id: string;
  name: string;
  mark: ProjectMark;
  description: string;
  image: string;
  github?: string;
  deployment?: string;
}
