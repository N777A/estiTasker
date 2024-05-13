import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import SectionIndex from "@/src/components/section/SectionIndex";
import EditProjectForm from "@/src/components/project/EditProjectForm";
import DeleteProjectButton from "@/src/components/project/DeleteProjectButton";
import IconMenu from "@/src/components/common/IconMenu";
import { Button, Link, MenuItem } from "@mui/material";
import useProjects from "@/src/hooks/useProjects";
import EditTaskForm from "@/src/components/task/EditTaskForm";
import IconButton from '@mui/material/IconButton';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import AutoTaskCreatorForm from "@/src/components/Llm/AutoTaskCreatorForm";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string);
  const taskId = parseInt(router.query.taskId as string);
  const { project, fetchProject } = useProjects();
  
  useEffect(() => {
    if (projectId) fetchProject(projectId);
  }, [projectId]);

  const navigateBack = () => {
    router.push({
      query: {
        projectId: projectId,
        taskId: undefined
      }
    },
      undefined,
      { shallow: true }
    );
  }

  return (
    <div className="flex">
      <div className='grow relative z-0 p-3'>
        <div className="flex items-center">
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
        <Button>
          <Link href={`../projects/${projectId}/Archive`}>アーカイブ</Link>
        </Button>
        <Button>
          <Link href={`../projects/${projectId}/Dashboard`}>ダッシュボード</Link>
        </Button>
        <SectionIndex />
      </div>
      <div className={`border-l-2 transition-all overflow-hidden z-40 ${taskId ? "fixed right-0 top-0 h-full bg-white w-full sm:w-96" : "w-0"}`}>
        {taskId && (
          <div className='flex items-center justify-end border-b-2 p-2 h-12'>
            <IconButton onClick={() => navigateBack()}><KeyboardTabIcon /></IconButton>
          </div>
        )}
        <EditTaskForm taskId={taskId} />
      </div>
    </div>
  )
}

export default ProjectTaskPage;
