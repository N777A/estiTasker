import { User } from './User'

export type SectionType = {
  title: string;
  position: number;
  id: number;
}

export type ApiResponseSectionType = {
  user: User;
  sections: SectionType[];
}

export type CreateSectionFormProps = {
  onAdd: (newSection: SectionType) => void;
}
