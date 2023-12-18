import { TaskType } from "../types/Task";
import apiClient from '../apiClient';

export const useLlm = {
  createTasks: async (description: string) => {
    try {
      const res = await apiClient.post('/llm/create_tasks', { input: description })
      return res;
    } catch (err) {
      console.error(err)
    }
  },
  estimateTaskTime: async (task: TaskType) => {
    try {
      const res = await apiClient.post('/llm/estimate_task_time', { task: task })
      return res;
    } catch (err) {
      console.error(err)
    }
  }
}
