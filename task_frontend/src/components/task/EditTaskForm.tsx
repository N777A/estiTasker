import React, { useCallback, useEffect, useState } from "react";
import { Box, TextField, debounce } from "@mui/material";
import useSections from "@/src/hooks/useSections";
import { BLANK_TASK, TaskType } from "@/src/types/Task";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs';
import { TaskId } from "@/src/types/Section";
import "react-widgets/styles.css";
import NumberPicker from "react-widgets/NumberPicker";
import useTimeConverter from "@/src/hooks/useTimeConverter";

export type EditTaskFormProps = {
  taskId: TaskId,
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ taskId }) => {
  const [dateForPicker, setDateForPicker] = useState<Dayjs | null>(null);
  const { sections, getTask, updateTask } = useSections()
  const [editTask, setEditTask] = useState<TaskType>(BLANK_TASK)
  const [ ,hoursAndMinutes ] = useTimeConverter();

  useEffect(() => {
    setEditTask(getTask(taskId) || BLANK_TASK);
  }, [taskId, sections])


  useEffect(() => {
    const times = hoursAndMinutes(Number(editTask.estimated_time));
    setNewHours(times.hours);
    setNewMinutes(times.minutes);
  }, [editTask]);

  const [newhours, setNewHours] = useState(0);
  const [newMinutes, setNewMinutes] = useState(0)


  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editTask) {
      setEditTask({ ...editTask, [name]: value })
    }
  }

  useEffect(() => {
    if (editTask.id > 0) {
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

  const formatHours = (value: number) => {
    return `${value} 時間`;
  };

  const formatMinutes = (value: number) => {
    return `${value} 分`;
  };

  const handleBlur = () => {
    updateTask({
      ...editTask,
      estimated_time: newhours * 60 + newMinutes
    })
  }
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
      <NumberPicker
        value={newhours}
        defaultValue={0}
        min={0}
        format={formatHours}
        style={{ width: '150px' }}
        onChange={value => {
          if (value !== null) {
            setNewHours(value);
          }
        }}
        onBlur={handleBlur}
      />
      <NumberPicker
        value={newMinutes}
        label='hours'
        defaultValue={0}
        step={5}
        min={0}
        max={55}
        format={formatMinutes}
        style={{ width: '150px' }}
        onChange={value => {
          if (value !== null) {
            setNewMinutes(value);
          }
        }}
        onBlur={handleBlur}
      />
    </div>
  )
}

export default EditTaskForm;
