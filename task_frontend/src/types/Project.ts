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

export const projectValidate = (name: string, value: string) => {
  if (name === 'title') {
    if (value.length > 20) return '20文字以内で入力してください'
    if (value.length === 0) return '入力が必須です'
  } else if (name === 'description') {
    if (value.length > 100) return '100文字以内で入力してください'
  } else {
  return null;
  }
}

export type CreateProjectResponseType = ProjectType;
