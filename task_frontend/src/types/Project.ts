import { User } from './User'

export type ProjectType = {
  title: string;
  description: string;
  icon: string;
  id?: number;
}

export type ListProjectResponseType = {
  user: User;
  projects: ProjectType[];
}

export type CreateProjectResponseType = ProjectType;
