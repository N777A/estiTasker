import React, { useState } from "react";
import { Box, Button, IconButton, Modal, TextField, Tooltip } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useLlm } from "@/src/hooks/useLlm";

// const INIT_PROJECT = { title: "", description: "", icon: "" };
// export type EditProjectFormProps = {
//   project: ProjectType | undefined
// }
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const AutoTaskCreatorForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState({ title: '', description: ''})
  const [aiDescription, setAiDescription] = useState('');

  const { createTasks } = useLlm;
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   const newError = validate(name, value)
  //   setProject({ ..._project, [name]: value });
  //   setError({...error, [name]: newError})
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAiDescription(e.target.value)
  }

  // const resetForm = () => {
  //   setProject(project || INIT_PROJECT)
  //   setShowForm(false)
  // }

  // const onSubmit = () => {
  //   updateProject(_project)
  //   resetForm();
  // }
  const onSubmit = () => {
    createTasks(aiDescription).then(res => console.log(res))
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
            name="aiDescription"
            label="aiDescription"
            placeholder="説明"
            // value={_project.title}
            className="mb-2"
            fullWidth
            onChange={handleChange}
            // error={!!error.title}
            // helperText={error.title}
          />
          <div>
            <Button onClick={() => setShowForm(false)}>キャンセル</Button>
            <Button
              variant="outlined"
              size="small"
              onClick={onSubmit}
              disabled={!!error.title || !!error.description}
            >
              Taskを自動作成
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default AutoTaskCreatorForm;
