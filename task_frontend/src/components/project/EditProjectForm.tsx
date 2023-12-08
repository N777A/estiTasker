import React, { useState } from "react";
import useProjects from "@/src/hooks/useProjects";
import { ProjectType, projectValidate } from "@/src/types/Project";
import { Box, Button, Modal, TextField } from "@mui/material";

const INIT_PROJECT = { title: "", description: "", icon: "" };
export type EditProjectFormProps = {
  project: ProjectType | undefined
}
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

const EditProjectForm: React.FC<EditProjectFormProps> = ({ project }) => {
  const { updateProject } = useProjects();
  const [_project, setProject] = useState<ProjectType>(project || INIT_PROJECT)
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState({ title: '', description: ''})
  const validate = projectValidate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newError = validate(name, value)
    setProject({ ..._project, [name]: value });
    setError({...error, [name]: newError})
  }

  const resetForm = () => {
    setProject(project || INIT_PROJECT)
    setShowForm(false)
  }

  const onSubmit = () => {
    updateProject(_project)
    resetForm();
  }

  return(
    <>
      <button onClick={() => setShowForm((prev) => !prev)}>プロジェクトを変更する</button>
      <Modal open={showForm} onClose={resetForm}>
        <Box sx={style}>
          <h2 className="mb-2">プロジェクトを変更</h2>
          <TextField
            name="title"
            label="タイトル"
            placeholder="タイトル"
            value={_project.title}
            className="mb-2"
            fullWidth
            onChange={handleChange}
            error={!!error.title}
            helperText={error.title}
          />
          <TextField
            name="description"
            label="説明"
            placeholder="説明"
            value={_project.description}
            className="mb-2"
            fullWidth
            multiline
            onChange={handleChange}
            error={!!error.description}
            helperText={error.description}
          />
          <div>
            <Button
              variant="outlined"
              size="small"
              onClick={onSubmit}
              disabled={!!error.title || !!error.description}
            >
              Projectを更新
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default EditProjectForm;
