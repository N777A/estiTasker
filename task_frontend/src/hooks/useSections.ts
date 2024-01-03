import { create } from 'zustand';
import apiClient from '../apiClient';
import { SectionResponseType, SectionType, cloneSections, formatSection, is_sections_equal } from '../types/Section';
import { TaskType, is_tasks_equal } from '../types/Task';
import { UniqueIdentifier } from '@dnd-kit/core';

const useSections = create<{
  currentProjectId: number,
  sections: Map<UniqueIdentifier, SectionType>,
  tasks: Map<UniqueIdentifier, TaskType>,
  fetchSections: (projectId: number) => void,
  getSection: (sectionId: UniqueIdentifier) => SectionType | undefined,
  addSection: (section: SectionType, projectId: number) => Promise<number | null>,
  updateSection: (section: SectionType, projectId: number) => void,
  deleteSection: (sectionId: UniqueIdentifier) => void,
  getTask: (taskId: UniqueIdentifier) => TaskType | undefined,
  addTask: (sectionId: UniqueIdentifier, task: TaskType) => Promise<void>,
  updateTask: (sectionId: UniqueIdentifier, task: TaskType) => void,
  deleteTask: (sectionId: UniqueIdentifier, task: TaskType) => void,
  reorderSection: (sectionId: UniqueIdentifier, previousSectionId: UniqueIdentifier, nextSectionId: UniqueIdentifier) => void;
}>((set, get) => {
  const INIT_STATE = {
    currentProjectId: 0,
    sections: new Map<UniqueIdentifier, SectionType>(),
    tasks: new Map<UniqueIdentifier, TaskType>(),
  }

  const fetchSections = async (projectId: number) => {
    try {
      // Clear displayed sections
      set(() => ({ sections: new Map<UniqueIdentifier, SectionType>() }));

      // Fetch Sections from Backend
      console.log("Fetch sections")
      const res = await apiClient.get<SectionResponseType[]>(`/projects/${projectId}/sections`);
      const _sectionsMap = new Map<UniqueIdentifier, SectionType>();
      const _taskMap = new Map<UniqueIdentifier, TaskType>();
      res.data.forEach(_section => {
        _sectionsMap.set(_section.id, formatSection(_section));
        _section.tasks?.forEach(_task => {
          _taskMap.set(_task.id, _task)
        })
      });

      set(() => ({
        currentProjectId: projectId,
        sections: _sectionsMap,
        tasks: _taskMap
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const getSection = (sectionId: UniqueIdentifier) => {
    return get().sections.get(sectionId)
  }

  const addSection = async (section: SectionType, projectId: number) => {
    try {
      const res = await apiClient.post<SectionResponseType>(`/projects/${projectId}/sections`, { section: section })
      const _section = res.data
      set((state) => {
        state.sections.set(_section.id, formatSection(_section));
        return {
          sections: cloneSections(state.sections),
        }
      })
      return _section.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const updateSection = async (section: SectionType, projectId: number) => {
    const _old_value: SectionType | undefined = get().sections.get(section.id)
    if (!_old_value || is_sections_equal(_old_value, section)) {
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

  const getTask = (taskId: UniqueIdentifier) => {
    return get().tasks.get(taskId)
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
    const _old_value: TaskType | undefined = get().sections.get(sectionId)?.tasks.get(task.id)
    if (!_old_value || is_tasks_equal(_old_value, task)) {
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
    getSection,
    addSection,
    updateSection,
    deleteSection,
    getTask,
    addTask,
    updateTask,
    deleteTask,
    reorderSection,
  }
})

export default useSections;
