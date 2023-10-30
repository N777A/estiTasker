import { User } from './User'
import React, { Dispatch, SetStateAction } from 'react';

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

export type DeleteSectionButtonProps  = {
  sectionId: number;
  onDelete: (sectionId: number) => void;
}

export type SectionTitleEditorProps = {
  sectionId: number;
  initialTitle: string;
  onSave: (sectionId: number, newTitle: string) => Promise<void>
  onFinishEditing: () => void;
  onTitleChange: (sectionId: number, newTitle: string) => void;
};
