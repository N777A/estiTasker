import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Box,  Button,  TextField, debounce } from "@mui/material";
import useSections from "@/src/hooks/useSections";
import { TaskType } from "@/src/types/Task";
import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs';
import DeleteTaskButton from '../../components/task/DeleteTaskButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useRouter } from "next/router";

const INITeditTask = { title: "", description: "", icon: "", status: 1 };
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

const ShowTaskPage: React.FC<EditTaskFormProps> = ( {sectionId, task, handleDrawer} ) => {
  const router = useRouter();
  const { taskId } = router.query;
  const [editTask, setEditTask] = useState(task)
  const [dateForPicker, setDateForPicker] = useState<Dayjs | null>(null);
  const { updateTask, getTask } = useSections()


//   useEffect(() => {
//     if (editTask) {
//       console.log('useEffect!!!')
//       onTaskChange(editTask);
//     }
//   }, [editTask]);

//   useEffect(() => {
// console.log("🌟")
//   }, [task])
//   const onTaskChange = useCallback(
//     debounce(
//       (
//         editTask: TaskType
//       ) => {
//         updateTask(sectionId, editTask)
//       },
//       1000
//     ),
//     []
//   );

//     const handleDateChange = (newValue: Dayjs | null) => {
//       if (newValue){
//         const dayjsDate = dayjs(newValue);
//         setEditTask({ ...editTask, due_date: dayjsDate.format('YYYY-MM-DD')} as TaskType);
//         setDateForPicker(newValue)
//       }
//     }

//   useEffect(() => {
//     if (editTask && editTask.due_date) {
//       const dayjsDate = dayjs(editTask.due_date)
//       setDateForPicker(dayjsDate);
//     }
//   }, [editTask])

  return(
    // <Box sx={style}>
    //     <h2 className="mb-2"></h2>
    //     <TextField
    //       name="title"
    //       label="タイトル"
    //       placeholder="タイトル"
    //       value={editTask?.title || ''}
    //       className="mb-2"
    //       fullWidth
    //       onChange={handleTextChange}
    //     />
    //     <TextField
    //       name="description"
    //       label="memo"
    //       placeholder="memo"
    //       value={editTask?.description || ''}
    //       className="mb-2"
    //       fullWidth
    //       multiline
    //       onChange={handleTextChange}
    //       minRows="10"
    //     />
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <Box sx={{ m: 2, width: '25ch' }}>
    //         <DatePicker
    //           label="期日"
    //           value={dateForPicker}
    //           onChange={handleDateChange}
    //           slotProps={{ textField: { variant: 'outlined' } }}
    //         />
    //       </Box>
    //     </LocalizationProvider>
    //     <DeleteTaskButton sectionId={sectionId} task={task} />
    // </Box>
    <>
      <h2>{taskId}</h2>
    </>
  )
}

export default ShowTaskPage;
