import { User } from './User'

export type ProjectType = {
  title: string,
  description: Text,
  icon: string,
  status: number,
}

export type ApiResponseProjectType = {
  user: User;
  projects: ProjectType[];
}
