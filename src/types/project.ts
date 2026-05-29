export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageKey?: string;
  github?: string;
  deployment?: string;
  sortOrder?: number;
}

export interface Profile {
  displayName: string;
  greeting: string;
  bio: string;
}
