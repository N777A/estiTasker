import { create } from 'zustand';
import { ListProjectResponseType, CreateProjectResponseType, ProjectType } from '../types/Project';
import apiClient from '../apiClient';
import { BLANK_SECTION, SectionResponseType, SectionType, cloneSections, formatSection, is_sections_equal } from '../types/Section';
import { TaskType, is_tasks_equal } from '../types/Task';

const useSections = create<{
  sections: Map<number, SectionType>,
  fetchSections: (projectId: number) => void,
  addSection: (section: SectionType, projectId: number) => void,
  updateSection: (section: SectionType, projectId: number) => void,
  deleteSection: (sectionId: number) => void,
  addTask: (sectionId: number, task: TaskType) => void,
  updateTask: (sectionId: number, task: TaskType) => void,
  deleteTask: (sectionId: number, task: TaskType) => void,
}>((set, get) => {
  const INIT_STATE = {
    sections: new Map<number, SectionType>(),
  }

  const fetchSections = async (projectId: number) => {
    try {
      const res = await apiClient.get<SectionResponseType[]>(`/projects/${projectId}/sections`);
      const _sectionsMap = new Map<number, SectionType>();
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
          sections: new Map<number, SectionType>(state.sections),
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
        return {
          sections: new Map<number, SectionType>(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteSection = async (sectionId: number) => {
    try {
      await apiClient.delete(`/sections/${sectionId}`)
      set((state) => {
        state.sections.delete(sectionId);
        return {
          sections: new Map<number, SectionType>(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const addTask = async (sectionId: number, task: TaskType) => {
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
    } catch (error) {
      console.error(error);
    }
  }

  const updateTask = async (sectionId: number, task: TaskType) => {
    const _old_value: TaskType = get().sections.get(sectionId)?.tasks.get(task.id)!
    if (is_tasks_equal(_old_value, task)) {
      return;
    }
    try {
      console.log("update task")
      const res = await apiClient.put<TaskType>(`/sections/${sectionId}/tasks/${task.id}`, { task: task });
      set((state) => {
        const _task = res.data
        console.log(_task)
        state.sections.get(sectionId)?.tasks.set(_task.id, _task)
        console.log(state.sections.get(sectionId)?.tasks.get(_task.id))
        return {
          sections: cloneSections(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (sectionId: number, task: TaskType) => {
    try {
      console.log("delete task")
      await apiClient.delete(`/sections/${sectionId}/tasks/${task.id}`)
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

  return {
    ...INIT_STATE,
    fetchSections,
    addSection,
    updateSection,
    deleteSection,
    addTask,
    updateTask,
    deleteTask,
  }
})

export default useSections;
