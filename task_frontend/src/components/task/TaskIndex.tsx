import apiClient from "@/src/apiClient";
import { TaskType } from "@/src/types/Task";
import { useEffect, useState } from "react";
import CreateTaskForm from "./CreateTaskForm";

const TaskIndex = ({ sectionId }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [taskAddFormId, setTaskAddFormId] = useState(null);

  const fetchTasks = async () => {
    // try {
    //   const res = await apiClient.get(`/sections/${sectionId}/tasks`)
    //   setTasks(res.data)
    // } catch(error) {
    //   console.error(error)
    // }
  }

  useEffect(() => {
    fetchTasks();
  }, [sectionId])

  const addNewTask = (newTask) => {
    setTasks((prev) => [ ...prev!, newTask])
  }

  return(
    <div>
      <ul>
        {tasks && tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
        <li>
          {taskAddFormId === sectionId && <CreateTaskForm sectionId={sectionId} toggleFormVisibility={setTaskAddFormId} onAdd={addNewTask} />}
        </li>
          <button onClick={() => setTaskAddFormId(sectionId)}>タスクを追加</button>
      </ul>
    </div>
  )
}

export default TaskIndex;
