import { User } from './User'


export type ProjectType = {
  title: string;
  description: Text;
  icon: string;
  status: number;
  id: string;
}

export type ApiResponseProjectType = {
  user: User;
  projects: ProjectType[];
}

export type CreateProjectFormProps = {
  onAdd: (newProject: ProjectType) => void;
}
