import { User } from './User'
import React,  { Dispatch, SetStateAction } from 'react';

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
  toggleFormVisibility: Dispatch<SetStateAction<boolean>>;
}
