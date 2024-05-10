import React, { useState } from "react";
import { Box, Button, IconButton, LinearProgress, Modal, TextField, Tooltip, Typography } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";
import useSections from "@/src/hooks/useSections";
import { BLANK_SECTION } from "@/src/types/Section";
import useTimeConverter from "@/src/hooks/useTimeConverter";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

export type AutoTaskCreatorFormProps = {
  projectId: number,
}

const AutoTaskCreatorForm: React.FC<AutoTaskCreatorFormProps> = ({ projectId }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState({ title: '', description: ''})
  const [aiTitle, setAiTitle] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false)
  const [isDisabledButton, setIsDisabledButton] = useState(false);
  const { addSection, addTask } = useSections();
  const { createTasks } = useLlm;
  const [, , convertMinutes] = useTimeConverter(); 

  const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAiTitle(e.target.value)
  }
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAiDescription(e.target.value)
  }

  const onSubmit = async () => {
    try {
      setIsDisabledButton(true)
      setIsCreating(true)
      const formatInfo = { title: aiTitle, description: aiDescription }
      const formatInfoString = JSON.stringify(formatInfo);
      const aiTasks = await createTasks(formatInfoString)
      const _section = JSON.parse(JSON.stringify(BLANK_SECTION))
      _section.title = aiTitle
      const addedSectionId = await addSection(_section)
      
      if (addedSectionId !== null && aiTasks?.data.tasks) {
        let newPosition = 1;
        for (const task of aiTasks.data.tasks) {
          task.position  = newPosition;
          const minutes = convertMinutes(task.estimated_time)
          task.estimated_time = minutes
          await addTask(addedSectionId, task);
          newPosition++;
        }
      }
      setShowForm(false)
      setAiTitle('')
      setAiDescription('')
      setIsCreating(false)
      setIsDisabledButton(false)
    } catch (err) {
      console.error('タスクの自動作成に失敗しました', err)
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setAiTitle('')
    setAiDescription('')
  }

  return(
    <div>
    <Tooltip title='AIタスク自動作成'>
        <IconButton
          size='large'
          color='secondary'
          onClick={() => setShowForm(prev => !prev)}
        >
          <AutoAwesomeIcon />
        </IconButton>
      </Tooltip>
      <Modal open={showForm}>
        <Box sx={style}>
          <Typography
            component='p'
            color='secondary'
            fontWeight='700'
            className="mb-4"
          >
            タスク自動作成
          </Typography>
          <TextField
            name="aiTitle"
            label='タイトル'
            placeholder='タイトル'
            value={aiTitle}
            onChange={handleTitleChange}
            color="secondary"
            fullWidth
            className="mb-4"
          />
          <TextField
            name="aiDescription"
            label="タスクの説明欄"
            placeholder="タスクの説明欄(AIが参考にします) 300字以内"
            value={aiDescription}
            className="mb-2"
            fullWidth
            onChange={handleDescriptionChange}
            color="secondary"
            multiline
            minRows="10"
            inputProps={{ maxLength: 300 }}
          />
          <div>
            <Button onClick={resetForm}>キャンセル</Button>
            <Button
              variant="outlined"
              size="large"
              onClick={onSubmit}
              disabled={isDisabledButton}
              color='secondary'
              startIcon={<AutoAwesomeIcon />}
            >
              タスクを自動作成
            </Button>
           {isCreating && <LinearProgress color="secondary" /> } 
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default AutoTaskCreatorForm;
