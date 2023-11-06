import { TaskType } from './Task';
import { User } from './User'
import React, { Dispatch, SetStateAction } from 'react';

export type SectionResponseType = {
  id: number;
  title: string;
  position: number;
  tasks: TaskType[] | undefined;
}

export type SectionType = {
  id: number;
  title: string;
  position: number;
  tasks: Map<number, TaskType>;
}

export const formatSection = (section: SectionResponseType): SectionType => {
  return {
    ...section,
    tasks: new Map<number, TaskType>(section.tasks?.map(task => [task.id, { ...task }]))
  }
}

export const cloneSections = (sections: Map<number, SectionType>): Map<number, SectionType> => {
  return JSON.parse(JSON.stringify(sections, replacer), reviver)
}

const replacer = (k: any, v: any) => {
  if (v instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(v)
    }
  }
  return v
}

const reviver = (k: any, v: any) => {
  if (typeof v === "object" && v !== null) {
    if (v.dataType === "Map") {
      return new Map(v.value)
    }
  }
  return v
}

export const BLANK_SECTION: SectionType = {
  id: 0,
  title: "無題のセクション",
  position: 0,
  tasks: new Map<number, TaskType>()
}

export type ApiResponseSectionType = {
  user: User;
  sections: SectionType[];
}

export type CreateSectionFormProps = {
  onAdd: (newSection: SectionType) => void;
  toggleFormVisibility: Dispatch<SetStateAction<boolean>>;
}

export type DeleteSectionButtonProps = {
  sectionId: number;
  onDelete: (sectionId: number) => void;
}

export type SectionTitleEditorProps = {
  sectionId: number;
  initialTitle: string;
  onSave: (sectionId: number, newTitle: string) => void
  onTitleChange: (sectionId: number, newTitle: string) => void;
};

export const is_section_empty = (section: SectionType): boolean => {
  return !section.title && section.tasks.size === 0
}

export const is_sections_equal = (section1: SectionType, section2: SectionType): boolean => {
  return JSON.stringify(section1) === JSON.stringify(section2)
}
