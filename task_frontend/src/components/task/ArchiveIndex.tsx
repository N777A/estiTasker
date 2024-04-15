import useSections from "@/src/hooks/useSections";
import { TaskType } from "@/src/types/Task";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ArchiveIndex:React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const { archives, fetchArchivedTasks, deleteTask, updateTask, getTask } = useSections();
  const router = useRouter();

  const handleDelete = async (task: TaskType) => {
    try {
      await deleteTask(task.section_id, task.id);
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (error) {
      console.log('タスク削除失敗', error)
    }
  }

  const handleDeleteAll = async () => {
    const answer = window.confirm('本当に全てのアーカイブを削除しますか？')
    if (answer) {
      try {
        const deletePromises = tasks.map((task) =>
          deleteTask(task.section_id, task.id)
        )
        await Promise.all(deletePromises)

        setTasks([]);
      } catch (error) {
        console.log('全てのアーカイブの削除に失敗しました', error)
      }
    }
  }

  const handleUnarchiveTask = async (task: TaskType) => {
    const res = getTask(602)
    const updatedTask = { ...task, archive: false };
    try {
      await updateTask(updatedTask)
      setTasks(prev => prev.filter(t => t.id !== task.id))
    } catch (error) {
      console.log('タスクのアーカイブ解除に失敗', error)
      throw error;
    }
  }

  useEffect(() => {
    if (router.query.projectId) {
      const projectId = parseInt(router.query.projectId as string);
      if (!isNaN(projectId)) {
        fetchArchivedTasks(projectId);
      }
    }
  }, [router.query.projectId, fetchArchivedTasks]);

  useEffect(() => {
    const tasksArray = Array.from(archives.values());
    setTasks(tasksArray)
  }, [archives]);

  return(
    <div>
      <h1>アーカイブ</h1>
      <Button onClick={handleDeleteAll}>全てのアーカイブを削除</Button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            <Button color='warning' onClick={() => handleDelete(task)}>削除</Button>
            <Button onClick={() => handleUnarchiveTask(task)}>タスク一覧に戻す</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ArchiveIndex;

