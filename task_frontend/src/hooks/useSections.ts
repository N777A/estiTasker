import { create } from 'zustand';
import apiClient from '../apiClient';
import { SectionId, SectionResponseType, SectionType, TaskId, cloneSection, cloneSections, cloneTasks, formatSection, is_sections_equal } from '../types/Section';
import { TaskType, is_tasks_equal } from '../types/Task';
import { UniqueIdentifier } from '@dnd-kit/core';
import { AdviceType } from '../types/Advice'
import { AdviceId } from '../types/Advice'

interface ArchiveResponse {
  archives: TaskType[];
  archives_count: number;
  unArchives_count: number;
  overdue_tasks_count: number;
  tasks_count: number;
}

const useSections = create<{
  currentProjectId: number,
  sections: Map<SectionId, SectionType>,
  tasks: Map<TaskId, TaskType>,
  archives: Map<TaskId, TaskType>,
  advices: Map<AdviceId, AdviceType>,
  archives_count: number,
  unArchives_count: number,
  overdue_tasks_count: number,
  tasks_count: number,
  fetchSections: (projectId: number) => void,
  getSection: (sectionId: UniqueIdentifier) => SectionType | undefined,
  addSection: (section: SectionType) => Promise<number | null>,
  updateSection: (section: SectionType) => void,
  deleteSection: (sectionId: SectionId) => void,
  getTask: (taskId: TaskId) => TaskType | undefined,
  addTask: (sectionId: SectionId, task: TaskType) => Promise<void>,
  updateTask: (task: TaskType) => Promise<void>,
  deleteTask: (sectionId: SectionId, taskId: TaskId) => void,
  fetchArchivedTasks: (projectId: number) => Promise<void>,
  fetchAdvices: (taskId: number) => Promise<void>,
  addAdvice: (taskId: number, advice: AdviceType) => Promise<void>
}>((set, get) => {
  const INIT_STATE = {
    currentProjectId: 0,
    sections: new Map<UniqueIdentifier, SectionType>(),
    tasks: new Map<UniqueIdentifier, TaskType>(),
    archives: new Map<UniqueIdentifier, TaskType>(),
    advices: new Map<UniqueIdentifier, AdviceType>(),
    archives_count: 0,
    unArchives_count: 0,
    overdue_tasks_count: 0,
    tasks_count: 0,
  }

  const fetchSections = async (projectId: number) => {
    try {
      set(() => ({ sections: new Map<UniqueIdentifier, SectionType>() }));

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

  const getSection = (sectionId: UniqueIdentifier): SectionType | undefined => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    let section = get().sections.get(sectionId)
    return section ? cloneSection(section) : undefined
  }

  const addSection = async (section: SectionType) => {
    try {
      const projectId = get().currentProjectId;
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

  const updateSection = async (section: SectionType) => {
    const _old_value: SectionType | undefined = get().sections.get(section.id)
    if (!_old_value || is_sections_equal(_old_value, section)) {
      return;
    }
    try {
      const res = await apiClient.put<SectionResponseType>(`/sections/${section.id}`, { section: section });
      set((state) => {
        const _section = res.data
        state.sections.set(_section.id, formatSection(_section));
        return {
          sections: cloneSections(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteSection = async (sectionId: UniqueIdentifier) => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    try {
      await apiClient.delete(`/sections/${sectionId}`)
      set((state) => {
        state.sections.delete(sectionId);
        return {
          sections: cloneSections(state.sections)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getTask = (taskId: TaskId): TaskType | undefined => {
    let task = get().tasks.get(taskId) || get().archives.get(taskId);
    return task ? JSON.parse(JSON.stringify(task)) : undefined;
  }

  const addTask = async (sectionId: UniqueIdentifier, task: TaskType) => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    try {
      const res = await apiClient.post<TaskType>(`/sections/${sectionId}/tasks`, { task: task });
      set((state) => {
        const _task = res.data
        state.sections.get(sectionId)?.tasks.set(_task.id, _task)
        state.tasks.set(_task.id, _task)
        return {
          sections: cloneSections(state.sections),
          tasks: cloneTasks(state.tasks)
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const updateTask = async (task: TaskType) => {
    const _old_value = await getTask(task.id)
    if (!_old_value || is_tasks_equal(_old_value, task)) {
      return;
    }
    try {
      const res = await apiClient.put<TaskType>(`/tasks/${task.id}`, { task: task });
      set((state) => {
        const _task = res.data
        state.sections.get(_task.section_id)?.tasks.set(_task.id, _task)
        if (_old_value.section_id !== _task.section_id) {
          state.sections.get(_old_value.section_id)?.tasks.delete(task.id)
        }
        state.tasks.set(_task.id, _task)
        return {
          sections: cloneSections(state.sections),
          tasks: cloneTasks(state.tasks)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (sectionId: SectionId, taskId: TaskId) => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    try {
      await apiClient.delete(`/tasks/${taskId}`)
      set((state) => {
        state.sections.get(sectionId)?.tasks.delete(taskId)
        state.tasks.delete(taskId)
        return {
          sections: cloneSections(state.sections),
          tasks: cloneTasks(state.tasks)
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const fetchArchivedTasks = async (projectId: number) => {
    try {
      set((state) => ({...state, archives: new Map<UniqueIdentifier, TaskType>() }));

      const res = await apiClient.get<ArchiveResponse>(`/projects/${projectId}/tasks/archive`);
      const _archivesMap = new Map<UniqueIdentifier, TaskType>();
      res.data.archives.forEach(_archive => {
        _archivesMap.set(_archive.id, _archive);
      
      });
      set((state) => ({
        ...state,
        archives: _archivesMap,
        archives_count: res.data.archives_count,
        unArchives_count: res.data.unArchives_count,
        overdue_tasks_count: res.data.overdue_tasks_count,
        tasks_count: res.data.tasks_count
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAdvices = async (taskId: number) => {
    try {
      set((state) => ({...state, advices: new Map<UniqueIdentifier, AdviceType>() }));

      const res = await apiClient.get<AdviceType[]>(`/tasks/${taskId}/advices`);
      const _advicesMap = new Map<UniqueIdentifier, AdviceType>();
      res.data.forEach(_advice => {
        _advicesMap.set(_advice.id, _advice);
      
      });
      set((state) => ({
        ...state,
        advices: _advicesMap
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const addAdvice = async (taskId: UniqueIdentifier, advice: AdviceType) => {
    taskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
    try {
      const res = await apiClient.post<AdviceType>(`/tasks/${taskId}/advices`, { advice: advice });
      set((state) => {
        const _advice = res.data
        const updatedAdvices = new Map(state.advices);
        updatedAdvices.set(_advice.id, _advice)
        return {
          ...state,
          advices: updatedAdvices
        }
      })
    } catch (error) {
      console.error(error);
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
    fetchArchivedTasks,
    fetchAdvices,
    addAdvice,
  }
})

export default useSections;
