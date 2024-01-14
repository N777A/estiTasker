import { IconButton, Modal, Tooltip, CircularProgress } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";
import useSections from "@/src/hooks/useSections";
import React, { useState } from "react";

const AutoTaskCreator = React.memo(({ task, sectionId }) => {
  const { createTasks } = useLlm;
  const { addTask } = useSections();
  const [isCreating, setIsCreating] = useState(false);

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    outline: 'none'
  };

  const handleClick = async () => {
    try {
      setIsCreating(true)
      const formatInfo = { title: task.title, description: task.description }
      const aiTasks = await createTasks(formatInfo)
      console.log('aiTasks:', aiTasks)

      if (aiTasks?.data.tasks) {
        for (const task of aiTasks.data.tasks) {
          const modefiedTitle = formatInfo.title + ' / ' + task.title
          const modefiedTask = { ...task, title: modefiedTitle }
          await addTask(sectionId, modefiedTask);
        }
      }
      setIsCreating(false)
    } catch (err) {
      console.log(err)
      setIsCreating(false)
    }
  }

  return (
    <>
      <Tooltip title='タスクを細分化'>
        <IconButton
          size='small'
          onClick={handleClick}
        >
          <AutoAwesomeIcon />
        </IconButton>
      </Tooltip>
      {isCreating && (
        <Modal open={isCreating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={modalStyle}>
            <CircularProgress color="secondary" />
          </div>
        </Modal>
      )}
    </>
  )
})

export default AutoTaskCreator;
