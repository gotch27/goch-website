export type ProjectMark = "diamond" | "triangle" | "circle" | "square";

export interface Project {
  id: string;
  name: string;
  mark: ProjectMark;
  description: string;
  image: string;
  imageKey?: string;
  github?: string;
  deployment?: string;
  sortOrder?: number;
}

export interface Profile {
  displayName: string;
  greeting: string;
  bio: string;
  portrait?: string;
  portraitKey?: string;
}
