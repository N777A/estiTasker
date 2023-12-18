
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox, TextField } from '@mui/material';
import { TaskType, is_new_task, is_task_empty } from '@/src/types/Task';
import { debounce } from 'lodash';
import useSections from '@/src/hooks/useSections';
import { UniqueIdentifier } from '@dnd-kit/core';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import EditTaskForm from './EditTaskForm';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type TaskItemProps = {
  sectionId: UniqueIdentifier,
  task: TaskType,
  removeBlankTask: (sectionId: UniqueIdentifier, taskId: number) => void,
}

const TaskItem: React.FC<TaskItemProps> = ({ sectionId, task, removeBlankTask }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [_task, setTask] = useState(task)
  const [drawer, setDrawer] = useState({
    right: false
  });
  const { addTask, updateTask, deleteTask } = useSections()

  // Drawer
  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setDrawer({right: open });
  };

  const list = () => (
    <Box
      sx={{ width: 500 }}
      role="presentation"
      data-dndkit-disabled-dnd-flag="true"
    >
      <EditTaskForm sectionId={sectionId} task={task} handleDrawer={setDrawer}/>
    </Box>
  );

  // Sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useSortable({id: task.id});

  const style = {
    margin: "10px",
    opacity: 1,
    color: "#333",
    background: "white",
    padding: "10px",
    transform: CSS.Transform.toString(transform),
    display: "flex",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask({ ..._task, [name]: value });
  }

  useEffect(() => {
    setTask(task);
  }, [task]);

  useEffect(() => {
    console.log('useEffect onTaskChange')
    onTaskChange(_task);
  }, [_task]);

  // useEffect(() => {
  //   console.log("_task updated to:", _task)
  // }, [_task])
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
            console.log('debounce')
          }
        }
      },
      1000
    ),
    []
  );

  const handleStatusChange = () => {
      const newStatus = _task.status === 2 ? 1 : 2;
      const updatedTaskStatus = { ..._task, status: newStatus}
      updateTask(sectionId, updatedTaskStatus)
      setTask(updatedTaskStatus as TaskType)
      console.log("handleStatusChange called with task:", _task)
  }

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
    <div ref={setNodeRef} style={style}>
      <Button {...listeners} {...attributes} size='small'><DragIndicatorIcon fontSize='small'/></Button>
      <Checkbox
        checked={_task.status === 2}
        onChange={handleStatusChange}
        disabled={is_new_task(_task)}
      />
      <TextField 
        name="title"
        ref={inputRef}
        value={_task.title}
        onChange={handleChange}
        onBlur={onBlur}
        data-dndkit-disabled-dnd-flag="true"
        sx={{
          width: 360,
          "& .MuiOutlinedInput-root": {
            "& fieldset": { 
              border: 'none'
            },
            "&:hover fieldset": {
              border: '1px solid rgba(0, 0, 0, 0.23)' // ホバー時の枠線スタイル
            },
          }
          
        }}
      >
      </TextField>
      {!is_task_empty(_task) && (
        <>
          <Button 
            onClick={toggleDrawer(true)}
            data-dndkit-disabled-dnd-flag="true"
          >
            <MoreVertIcon fontSize='small'/>
          </Button>
          <Drawer 
            anchor="right"
            open={drawer.right}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </>
       
      )}
    </div>
  );
}

export default TaskItem;
