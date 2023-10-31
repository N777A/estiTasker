import { User } from './User'
import { Dispatch, SetStateAction } from 'react';

export type ProjectType = {
  title: string;
  description: string;
  icon: string;
  id?: number;
}

export type ApiResponseProjectType = {
  user: User;
  projects: ProjectType[];
}

export type CreateProjectFormProps = {
  onAdd: (newProject: ProjectType) => void;
  toggleFormVisibility: Dispatch<SetStateAction<boolean>>;
}
