import apiClient from '../apiClient';

export const useLlm = {
  createTasks: async (description: string) => {
    try {
      const res = await apiClient.post('/llm/create_tasks', { input: description })
      return res;
    } catch (err) {
      console.error('タスクの自動作成に失敗しました', err)
    }
  },

  adviceTask: async (description: string) => {
    try {
      const res = await apiClient.post('/llm/advice_task', { input: description })
      return res;
    } catch (err) {
      console.error('タスクのアドバイスの生成に失敗しました', err)
      return null;
    }
  },
}
