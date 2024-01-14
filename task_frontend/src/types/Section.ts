import { UniqueIdentifier } from '@dnd-kit/core';
import { TaskType } from './Task';
import { User } from './User'
import { Dispatch, SetStateAction } from 'react';

export type SectionId = UniqueIdentifier;
export type TaskId = UniqueIdentifier;
export type Items = Record<SectionId, TaskId[]>;

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
  tasks: Map<TaskId, TaskType>;
}

export const formatSection = (section: SectionResponseType): SectionType => {
  return {
    ...section,
    tasks: new Map<TaskId, TaskType>(section.tasks?.map(task => [task.id, { ...task }]))
  }
}

// Mapがjsonへ変換した際に上手く変換できないため、MapをArrayに変換して再び戻している
export const cloneSections = (sections: Map<SectionId, SectionType>): Map<SectionId, SectionType> => {
  return JSON.parse(JSON.stringify(sections, replacer), reviver)
}

export const cloneSection = (sections: SectionType): SectionType => {
  return JSON.parse(JSON.stringify(sections, replacer), reviver)
}

export const cloneTasks = (sections: Map<TaskId, TaskType>): Map<TaskId, TaskType> => {
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
  tasks: new Map<TaskId, TaskType>()
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

// Map<SectionId, SectionType> から { SectionId: TaskId[] } へ変換
export const sections2items = (sections: Map<SectionId, SectionType>): Items => {
  return Object.fromEntries(Array.from(sections.values()).map(section => [
    section.id,
    Array.from(section.tasks.values()).sort((taskA, taskB) => taskA.position - taskB.position).map(task => task.id)
  ]))
}
