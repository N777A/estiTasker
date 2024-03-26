import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import SectionIndex from "@/src/components/section/SectionIndex";
import EditProjectForm from "@/src/components/project/EditProjectForm";
import DeleteProjectButton from "@/src/components/project/DeleteProjectButton";
import IconMenu from "@/src/components/common/IconMenu";
import { MenuItem } from "@mui/material";
import useProjects from "@/src/hooks/useProjects";
import EditTaskForm from "@/src/components/task/EditTaskForm";
import IconButton from '@mui/material/IconButton';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import AutoTaskCreatorForm from "@/src/components/Llm/AutoTaskCreatorForm";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const projectId: number = parseInt(router.query.projectId as string)
  const taskId: number = parseInt(router.query.taskId as string)
  const { project, fetchProject } = useProjects();
  useEffect(() => {
    if (projectId) fetchProject(projectId);
  }, [projectId])

  const navigateBack = () => {
    router.push({
      query: {
        projectId: projectId,
        taskId: undefined
      }
    },
      undefined,
      { shallow: true }
    )
  }

  return (
    <div className="flex">
      <div className='grow'>
        <div className='flex items-center border-b-2 p-2 h-12'>
          <h2 className="text-lg mr-4">{project?.title}</h2>

          <IconMenu>
            <MenuItem>
              <EditProjectForm project={project} />
            </MenuItem>
            <MenuItem>
              <DeleteProjectButton project={project} />
            </MenuItem>
          </IconMenu>
          <AutoTaskCreatorForm projectId={projectId} />
        </div>
        <SectionIndex />
        <small>Icon by icons8.com</small>
      </div>
      <div className={`border-l-2 transition-all overflow-hidden ${taskId ? "w-96" : "w-0"}`}>
        <div className='flex items-center justify-end border-b-2 p-2 h-12'>
          <IconButton onClick={() => navigateBack()}><KeyboardTabIcon></KeyboardTabIcon></IconButton>
        </div>
        <EditTaskForm taskId={taskId}></EditTaskForm>
      </div>
    </div>
  )
}

export default ProjectTaskPage;
