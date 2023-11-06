import { create } from 'zustand';
import { ListProjectResponseType, CreateProjectResponseType, ProjectType } from '../types/Project';
import apiClient from '../apiClient';
import { SectionType } from '../types/Section';
import { TaskType } from '../types/Task';

const useProjects = create<{
  projects: { [key: string]: ProjectType },
  project: ProjectType | undefined,
  fetchProjects: () => void,
  fetchProject: (projectId: number) => void,
  addProject: (project: ProjectType) => void,
  updateProject: (project: ProjectType) => void,
  deleteProject: (projectId: number) => void,
}>((set) => {
  const INIT_STATE = {
    projects: {},
    project: undefined,
  }

  const array2Dict = (items: ProjectType[]): { [key: string]: ProjectType } => {
    return Object.fromEntries(items.map(item => [item.id, item]))
  }

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get<ListProjectResponseType>('/projects')
      set(() => { return { projects: array2Dict(res.data.projects) } })
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProject = async (projectId: number) => {
    try {
      const res1 = await apiClient.get<ProjectType>(`/projects/${projectId}`);
      set(() => { return { project: res1.data } })
    } catch (error) {
      console.error(error)
    }
  }

  const addProject = async (project: ProjectType) => {
    try {
      const res = await apiClient.post<ProjectType>('/projects', { project: project })
      set((state) => {
        if (res.data?.id) {
          state.projects[res.data?.id] = res.data
        }
        return { projects: state.projects } 
      })
    } catch (error) {
      console.error(error);
    }
  }

  const updateProject = async (project: ProjectType) => {
    try {
      const res = await apiClient.put<ProjectType>(`/projects/${project.id}`, { project: project });
      set(() => { return { project: res.data } })
      set((state) => {
        if (res.data?.id) {
          state.projects[res.data?.id] = res.data
        }
        return { projects: state.projects }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteProject = async (projectId: number) => {
    try {
      await apiClient.delete(`/projects/${projectId}`)
      fetchProjects()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    ...INIT_STATE,
    fetchProjects,
    fetchProject,
    addProject,
    updateProject,
    deleteProject,
  }
})

export default useProjects;
