import { useState } from "react";
import { ProjectType } from "../../types/Project";
import useProjects from "@/src/hooks/useProjects";
import { Box, Button, Modal, TextField } from "@mui/material";

const INIT_PROJECT = { title: "", description: "", icon: "" };
export type CreateProjectFormProps = {}
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

const CreateProjectForm: React.FC<CreateProjectFormProps> = () => {
  const [showForm, setShowForm] = useState(false);
  const [project, setProject] = useState<ProjectType>(INIT_PROJECT);
  const { addProject } = useProjects();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  }

  const resetForm = () => {
    setProject(INIT_PROJECT)
    setShowForm(false)
  }

  const onSubmit = () => {
    addProject(project)
    resetForm()
  }

  return (
    <>
      <Button variant="outlined" size="small" onClick={() => setShowForm((prev) => !prev)}>新しいProjectを作成</Button>
      <Modal open={showForm} onClose={resetForm}>
        <Box sx={style}>
          <h2 className="mb-2">新規プロジェクト作成</h2>
          <TextField
            name="title"
            label="タイトル"
            placeholder="タイトル"
            value={project.title}
            className="mb-2"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="説明"
            placeholder="説明"
            value={project.description}
            className="mb-2"
            fullWidth
            multiline
            onChange={handleChange}
          />
          <div>
            <Button variant="outlined" size="small" onClick={onSubmit}>
              Projectを作成
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default CreateProjectForm;
