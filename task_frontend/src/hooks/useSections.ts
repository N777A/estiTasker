import { create } from 'zustand';
import apiClient from '../apiClient';
import { SectionId, SectionResponseType, SectionType, TaskId, cloneSection, cloneSections, cloneTasks, formatSection, is_sections_equal } from '../types/Section';
import { TaskType, is_tasks_equal } from '../types/Task';
import { UniqueIdentifier } from '@dnd-kit/core';

const useSections = create<{
  currentProjectId: number,
  sections: Map<SectionId, SectionType>,
  tasks: Map<TaskId, TaskType>,
  fetchSections: (projectId: number) => void,
  getSection: (sectionId: UniqueIdentifier) => SectionType | undefined,
  addSection: (section: SectionType) => Promise<number | null>,
  updateSection: (section: SectionType) => void,
  deleteSection: (sectionId: SectionId) => void,
  getTask: (taskId: TaskId) => TaskType | undefined,
  addTask: (sectionId: SectionId, task: TaskType) => Promise<void>,
  updateTask: (task: TaskType) => Promise<void>,
  deleteTask: (sectionId: SectionId, taskId: TaskId) => void,
  // reorderSection: (sectionId: UniqueIdentifier, previousSectionId: UniqueIdentifier, nextSectionId: UniqueIdentifier) => void;
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
    let task = get().tasks.get(taskId)
    return task ? JSON.parse(JSON.stringify(task)) : undefined;
  }

  const addTask = async (sectionId: UniqueIdentifier, task: TaskType) => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    try {
      console.log("add task")
      const res = await apiClient.post<TaskType>(`/sections/${sectionId}/tasks`, { task: task });
      set((state) => {
        const _task = res.data
        // console.log(_task)
        state.sections.get(sectionId)?.tasks.set(_task.id, _task)
        // console.log(state.sections.get(sectionId)?.tasks.get(_task.id))
        state.tasks.set(_task.id, _task)
        return {
          sections: cloneSections(state.sections),
          tasks: cloneTasks(state.tasks)
        }
      })
      console.log("addTask called with sectionId:", sectionId, "and task:", task)
    } catch (error) {
      console.error(error);
    }
  }

  const updateTask = async (task: TaskType) => {
    const _old_value = getTask(task.id)
    if (!_old_value || is_tasks_equal(_old_value, task)) {
      return;
    }
    try {
      console.log("update task")
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
      // console.log("updateTask called with sectionId:", task.section_id, "and task:", task)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (sectionId: SectionId, taskId: TaskId) => {
    sectionId = typeof sectionId === 'string' ? parseInt(sectionId) : sectionId;
    try {
      console.log("delete task")
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

  // const reorderSection = async (sectionId: UniqueIdentifier, previouSectionId: UniqueIdentifier, nextSectionId: UniqueIdentifier) => {
  //   try {
  //     const res = await apiClient.patch(`/sections/${sectionId}/update_position`, {
  //       previous_section_id: previouSectionId,
  //       next_section_id: nextSectionId
  //     });

  //     set((state) => {
  //       const _section = res.data
  //       state.sections.set(_section.id, formatSection(_section));
  //       return {
  //         sections: cloneSections(state.sections),
  //       }
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

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
    // reorderSection,
  }
})

export default useSections;
