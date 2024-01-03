import { IconButton, Tooltip } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";
import useSections from "@/src/hooks/useSections";

const AutoTaskCreator  = ({ task, sectionId })  => {
  const { createTasks } = useLlm;
  const { addTask } = useSections();
  
  const handleClick = async() => {
    try {
      const formatInfo = { title: task.title, description: task.description }
      const aiTasks = await createTasks(formatInfo)
      console.log('aiTasks:', aiTasks)
      
      if (aiTasks?.data.tasks) {
        for (const task of aiTasks.data.tasks) {
          const modefiedTitle = formatInfo.title + ' / ' + task.title
          const modefiedTask = { ...task, title: modefiedTitle}
          await addTask(sectionId, modefiedTask);

        }
      }
    } catch(err) {
      console.log(err)
    }
  }

  return(
    <>
    <Tooltip title='タスクを細分化'>
      <IconButton
        size='small'
        onClick={handleClick}
      >
        <AutoAwesomeIcon />
      </IconButton>
    </Tooltip>
    </>
  )
}

export default AutoTaskCreator;
