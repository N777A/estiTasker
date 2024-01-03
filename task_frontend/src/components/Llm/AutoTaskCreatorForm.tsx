import React, { useState } from "react";
import { Box, Button, IconButton, LinearProgress, Modal, TextField, Tooltip } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";
import useSections from "@/src/hooks/useSections";
import { BLANK_SECTION } from "@/src/types/Section";

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
      const aiTasks = await createTasks(aiDescription)
      console.log('aiTasks:', aiTasks)
      
      const _section = JSON.parse(JSON.stringify(BLANK_SECTION))
      _section.title = aiTitle
      const addedSectionId = await addSection(_section, projectId)
      
      if (addedSectionId !== null && aiTasks?.data.tasks) {
        for (const task of aiTasks.data.tasks) {
          await addTask(addedSectionId, task);
        }
      }
      setShowForm(false)
      setAiTitle('')
      setAiDescription('')
      setIsCreating(false)
      setIsDisabledButton(false)
    } catch (err) {
      console.log(err)
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setAiTitle('')
    setAiDescription('')
  }

  return(
    <>
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
          <h2 className="mb-2">Task自動作成</h2>
          <TextField
            name="aiTitle"
            label='aiTitle'
            placeholder='タイトル'
            value={aiTitle}
            onChange={handleTitleChange}
            color="secondary"
            fullWidth
          />
          <TextField
            name="aiDescription"
            label="aiDescription"
            placeholder="説明"
            value={aiDescription}
            className="mb-2"
            fullWidth
            onChange={handleDescriptionChange}
            color="secondary"
            multiline
            minRows="10"
            // error={!!error.title}
            // helperText={error.title}
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
    </>
  )
}

export default AutoTaskCreatorForm;
