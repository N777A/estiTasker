import useSections from "@/src/hooks/useSections";
import { Button } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { UniqueIdentifier } from "@dnd-kit/core";
import { TaskType } from "@/src/types/Task";
import React from "react";

export type EditDeleteTaskProps = {
  sectionId: UniqueIdentifier,
  task: TaskType | undefined,
}

const DeleteTaskButton: React.FC<EditDeleteTaskProps> = ({ sectionId, task }) => {
  const { deleteTask } = useSections();
  const handleDelete = () => {
    if (task) {
      deleteTask(sectionId, task)
      alert('タスクを削除しました')
    }
  }
  return (
    <Button onClick={handleDelete} color="error" >
      <DeleteForeverIcon fontSize='small' />
      タスクを削除
    </Button>
  )
}

export default DeleteTaskButton;
