export type TaskType = {
  id: number;
  title: string;
  description: string;
  status: number;
  dueDate: string;
  sectionId: number;
  position: number;
}

export const BLANK_TASK: TaskType = {
  id: -1, // 0 の時は初期化状態。データベース登録後、正しい ID になる。
  title: "",
  description: "",
  status: 0,
  dueDate: "",
  sectionId: 0,
  position: 0
}

export const is_new_task = (task: TaskType): boolean => {
  return task.id === -1
}

export const is_task_empty = (task: TaskType): boolean => {
  return !task.title && !task.description
}

export const is_tasks_equal = (task1: TaskType, task2: TaskType): boolean => {
  return JSON.stringify(task1) === JSON.stringify(task2)
}
