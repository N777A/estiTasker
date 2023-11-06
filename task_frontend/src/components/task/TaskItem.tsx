
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TextField } from '@mui/material';
import { TaskType, is_new_task, is_task_empty } from '@/src/types/Task';
import { debounce } from 'lodash';
import useSections from '@/src/hooks/useSections';

export type TaskItemProps = {
  sectionId: number,
  task: TaskType,
  removeBlankTask: (sectionId: number, taskId: number) => void,
}

const TaskItem: React.FC<TaskItemProps> = ({ sectionId, task, removeBlankTask }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_task, setTask] = useState(task)
  const { addTask, updateTask, deleteTask } = useSections()

  // Sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: task.id});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ..._task, [name]: value });
  }

  // useEffect(() => {
  //   if (is_new_task(task)) {
  //     inputRef.current?.focus();
  //   }
  // }, [task]);

  useEffect(() => {
    setTask(task);
  }, [task]);

  useEffect(() => {
    onTaskChange(_task);
  }, [_task]);

  const onTaskChange = useCallback(
    debounce(
      (
        _task: TaskType
      ) => {
        if (!is_task_empty(_task)) {
          if (is_new_task(_task)) {
            addTask(sectionId, _task)
          } else {
            updateTask(sectionId, _task)
          }
        }
      },
      1000
    ),
    []
  );

  const onBlur = () => {
    if (is_task_empty(_task)) {
      if (is_new_task(_task)) {
        removeBlankTask(sectionId, _task.id)
      } else {
        deleteTask(sectionId, _task)
      }
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TextField name="title" ref={inputRef} value={_task.title} onChange={handleChange} onBlur={onBlur}></TextField>
    </div>
  );
}

export default TaskItem;
