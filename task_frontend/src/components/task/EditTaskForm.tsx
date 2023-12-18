import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Box, Button, TextField, debounce } from "@mui/material";
import useSections from "@/src/hooks/useSections";
import { TaskType } from "@/src/types/Task";
import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteTaskButton from './DeleteTaskButton';

const INIT_TASK = { title: "", description: "", icon: "", status: 1 };
export type EditTaskFormProps = {
  sectionId: UniqueIdentifier,
  task: TaskType | undefined,
  handleDrawer: Dispatch<SetStateAction<{ right: boolean; }>>;
}
const style = {
  gap: '20px',
  marginLeft: '10%',
  width: '80%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
};

const EditTaskForm: React.FC<EditTaskFormProps> = ( {sectionId, task, handleDrawer} ) => {
  const [_task, setTask] = useState(task)
  const [dateForPicker, setDateForPicker] = useState<Dayjs | null>(null);
  const { updateTask } = useSections()

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (_task) {
    setTask({ ..._task, [name]: value })
    }
  }

  const handleStatusClick = () => {
    if (_task) {
      const newStatus = _task.status === 2 ? 1 : 2;
      setTask({ ..._task, status: newStatus } as TaskType)
    }
  }
  useEffect(() => {
    if (_task) {
      console.log('useEffect!!!')
      onTaskChange(_task);
    }
  }, [_task]);

  const onTaskChange = useCallback(
    debounce(
      (
        _task: TaskType
      ) => {
        updateTask(sectionId, _task)
      },
      1000
    ),
    []
  );

      const handleDateChange = (newValue: Dayjs | null) => {
        if (newValue){
          const dayjsDate = dayjs(newValue);
          setTask({ ..._task, due_date: dayjsDate.format('YYYY-MM-DD')} as TaskType);
          setDateForPicker(newValue)
        }
      }

  useEffect(() => {
    if (_task && _task.due_date) {
      const dayjsDate = dayjs(_task.due_date)
      setDateForPicker(dayjsDate);
    }
  }, [_task])

  return(
    <Box sx={style}>
        <h2 className="mb-2"></h2>
        <Button 
          variant={_task?.status  == 2 ? 'contained' : 'outlined'} 
          onClick={handleStatusClick} 
          size='large'
          style={_task?.status == 2 ? {backgroundColor: '#2196f3', color: 'white'} : {color: '#2196f3'}}
          startIcon={_task?.status == 2 ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
        >
          {_task?.status == 2 ? '完了' : '未完了'}
        </Button>
        <TextField
          name="title"
          label="タイトル"
          placeholder="タイトル"
          value={_task?.title || ''}
          className="mb-2"
          fullWidth
          onChange={handleTextChange}
        />
        <TextField
          name="description"
          label="memo"
          placeholder="memo"
          value={_task?.description || ''}
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
        <DeleteTaskButton sectionId={sectionId} task={task} />
    </Box>
  )
}

export default EditTaskForm;
