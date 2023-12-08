import { create } from 'zustand';
import { ListProjectResponseType, CreateProjectResponseType, ProjectType } from '../types/Project';
import apiClient from '../apiClient';
import { BLANK_SECTION, SectionResponseType, SectionType, cloneSections, formatSection, is_sections_equal } from '../types/Section';
import { TaskType, is_tasks_equal } from '../types/Task';
import { UniqueIdentifier } from '@dnd-kit/core';

const useSections = create<{
  sections: Map<UniqueIdentifier, SectionType>,
  fetchSections: (projectId: number) => void,
  addSection: (section: SectionType, projectId: number) => void,
  updateSection: (section: SectionType, projectId: number) => void,
  deleteSection: (sectionId: UniqueIdentifier) => void,
  addTask: (sectionId: UniqueIdentifier, task: TaskType) => void,
  updateTask: (sectionId: UniqueIdentifier, task: TaskType) => void,
  deleteTask: (sectionId: UniqueIdentifier, task: TaskType) => void,
  reorderSection: (sectionId: UniqueIdentifier, previousSectionId: UniqueIdentifier, nextSectionId: UniqueIdentifier) => void;
}>((set, get) => {
  const INIT_STATE = {
    sections: new Map<UniqueIdentifier, SectionType>(),
  }

  const fetchSections = async (projectId: number) => {
    try {
      console.log("fetchSections")
      const res = await apiClient.get<SectionResponseType[]>(`/projects/${projectId}/sections`);
      const _sectionsMap = new Map<UniqueIdentifier, SectionType>();
      res.data.forEach(_section => {
        _sectionsMap.set(_section.id, formatSection(_section));
      });
      set(() => { return { sections: _sectionsMap } })
    } catch (err) {
      console.error(err)
    }
  }

  const addSection = async (section: SectionType, projectId: number) => {
    try {
      const res = await apiClient.post<SectionResponseType>(`/projects/${projectId}/sections`, { section: section })
      set((state) => {
        const _section = res.data
        state.sections.set(_section.id, formatSection(_section));
        return {
          sections: cloneSections(state.sections),
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const updateSection = async (section: SectionType, projectId: number) => {
    const _old_value: SectionType = get().sections.get(section.id)!
    if (is_sections_equal(_old_value, section)) {
      return;
    }
    try {
      console.log("update section")
      const res = await apiClient.put<SectionResponseType>(`/sections/${section.id}`, { section: section });
      set((state) => {
        const _section = res.data
        state.sections.set(_section.id, formatSection(_section));
        console.log(section.id, Array.from(state.sections.values()).map(section => section.position))
        return {
          sections: cloneSections(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteSection = async (sectionId: UniqueIdentifier) => {
    try {
      await apiClient.delete(`/sections/${sectionId}`)
      set((state) => {
        state.sections.delete(sectionId);
        return {
          sections: new Map<UniqueIdentifier, SectionType>(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const addTask = async (sectionId: UniqueIdentifier, task: TaskType) => {
    try {
      console.log("add task")
      const res = await apiClient.post<TaskType>(`/sections/${sectionId}/tasks`, { task: task });
      set((state) => {
        const _task = res.data
        console.log(_task)
        state.sections.get(sectionId)?.tasks.set(_task.id, _task)
        console.log(state.sections.get(sectionId)?.tasks.get(_task.id))
        return {
          sections: cloneSections(state.sections)
        }
      })
      console.log("addTask called with sectionId:", sectionId, "and task:", task)
    } catch (error) {
      console.error(error);
    }
  }

  const updateTask = async (sectionId: UniqueIdentifier, task: TaskType) => {
    const _old_value: TaskType = get().sections.get(sectionId)?.tasks.get(task.id)!
    if (is_tasks_equal(_old_value, task)) {
      return;
    }
    try {
      console.log("update task")
      const res = await apiClient.put<TaskType>(`/tasks/${task.id}`, { task: task });
      set((state) => {
        const _task = res.data
        state.sections.get(sectionId)?.tasks.set(_task.id, _task)
        return {
          sections: cloneSections(state.sections)
        }
      })
      console.log("updateTask called with sectionId:", sectionId, "and task:", task)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (sectionId: UniqueIdentifier, task: TaskType) => {
    try {
      console.log("delete task")
      await apiClient.delete(`/tasks/${task.id}`)
      set((state) => {
        state.sections.get(sectionId)?.tasks.delete(task.id)
        return {
          sections: cloneSections(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const reorderSection = async (sectionId: UniqueIdentifier, previouSectionId: UniqueIdentifier, nextSectionId: UniqueIdentifier) => {
    try {
     const res = await apiClient.patch(`/sections/${sectionId}/update_position`, {
      previous_section_id: previouSectionId,
      next_section_id: nextSectionId
      });

      set((state) => {
        const _section = res.data
        state.sections.set(_section.id, formatSection(_section));
        return {
          sections: cloneSections(state.sections),
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  return {
    ...INIT_STATE,
    fetchSections,
    addSection,
    updateSection,
    deleteSection,
    addTask,
    updateTask,
    deleteTask,
    reorderSection,
  }
})

export default useSections;
