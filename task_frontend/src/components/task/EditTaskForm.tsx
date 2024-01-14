import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Box, Button, TextField, debounce } from "@mui/material";
import useSections from "@/src/hooks/useSections";
import { BLANK_TASK, TaskType } from "@/src/types/Task";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs';
import { TaskId } from "@/src/types/Section";

export type EditTaskFormProps = {
  taskId: TaskId,
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ taskId }) => {
  const [dateForPicker, setDateForPicker] = useState<Dayjs | null>(null);
  const { sections, getTask, updateTask } = useSections()
  const [editTask, setEditTask] = useState<TaskType>(BLANK_TASK)

  useEffect(() => {
    setEditTask(getTask(taskId) || BLANK_TASK);
  }, [taskId, sections])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value })
      // setTask({ ...task, [name]: value })
    }
  }

  useEffect(() => {
    if (editTask.id > 0) {
      console.log('useEffect!!!')
      onTaskChange(editTask);
    }
  }, [editTask]);

  const onTaskChange = useCallback(
    debounce(
      (
        editTask: TaskType
      ) => {
        updateTask(editTask)
      },
      1000
    ),
    []
  );

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const dayjsDate = dayjs(newValue);
      setEditTask({ ...editTask, due_date: dayjsDate.format('YYYY-MM-DD') } as TaskType);
      setDateForPicker(newValue)
    }
  }

  useEffect(() => {
    if (editTask && editTask.due_date) {
      const dayjsDate = dayjs(editTask.due_date)
      setDateForPicker(dayjsDate);
    }
  }, [editTask])

  return (
    <div className="p-4 w-auto">
      <h2 className="mb-2"></h2>
      <TextField
        name="title"
        label="タイトル"
        placeholder="タイトル"
        value={editTask?.title || ''}
        className="mb-2"
        fullWidth
        onChange={handleTextChange}
      />
      <TextField
        name="description"
        label="memo"
        placeholder="memo"
        value={editTask?.description || ''}
        className="mb-2"
        fullWidth
        multiline
        onChange={handleTextChange}
        minRows="10"
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ m: 2, width: '25ch' }}>
          <DatePicker
            label="期日"
            value={dateForPicker}
            onChange={handleDateChange}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </Box>
      </LocalizationProvider>
      {/* <DeleteTaskButton sectionId={sectionId} task={task} /> */}
    </div>
  )
}

export default EditTaskForm;
