import { IconButton, Modal, Tooltip, CircularProgress } from "@mui/material"
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";
import useSections from "@/src/hooks/useSections";
import React, { useState } from "react";
import { TaskType } from "@/src/types/Task";
import { UniqueIdentifier } from "@dnd-kit/core";

type AutoTaskCreatorProps = {
  task: TaskType;
  sectionId: UniqueIdentifier;
};

const AutoTaskCreator = React.memo(({ task, sectionId }: AutoTaskCreatorProps) => {
  const { createTasks } = useLlm;
  const { addTask, sections } = useSections();
  const [isCreating, setIsCreating] = useState(false);

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    outline: 'none',
  };

  
  const handleClick = async () => {
    try {
      setIsCreating(true)
      const formatInfo = { title: task.title, description: task.description, originalTaskEstimatedTime: task.estimated_time }
      const formatInfoString = JSON.stringify(formatInfo);
      const aiTasks = await createTasks(formatInfoString)

      if (aiTasks?.data.tasks) {
        const sectionTasks = Array.from(sections.get(sectionId)?.tasks.values() ?? []);
        sectionTasks.sort((taskA, taskB) => taskA.position - taskB.position)

        let previousPosition = task.position;
        const nextTask = sectionTasks.findIndex(task => task.position > previousPosition)
        let gap, startPosition;
      
          if (nextTask !== -1) {
            const nextTaskPosition = sectionTasks[nextTask].position;
            gap = (nextTaskPosition - previousPosition) / (aiTasks.data.tasks.length + 1)
            startPosition = previousPosition + gap;
          } else {
            startPosition = previousPosition + 1;
            gap = 1
          }

        for (const aiTask of aiTasks.data.tasks) {
          const modefiedTitle = formatInfo.title + ' / ' + aiTask.title
          const modefiedTask = { ...task, title: modefiedTitle, position: startPosition }
          await addTask(sectionId, modefiedTask);
          startPosition += gap;
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
          <AutoAwesomeIcon fontSize="small"/>
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

AutoTaskCreator.displayName = 'AutoTaskCreator';

export default AutoTaskCreator;
