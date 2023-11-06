import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import SectionIndex from "@/src/components/section/SectionIndex";
import EditProjectForm from "@/src/components/project/EditProjectForm";
import DeleteProjectButton from "@/src/components/project/DeleteProjectButton";
import IconMenu from "@/src/components/common/IconMenu";
import { MenuItem } from "@mui/material";
import useProjects from "@/src/hooks/useProjects";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const projectId: number = parseInt(router.query.projectId as string)
  const { project, fetchProject } = useProjects();

  useEffect(() => {
    if (projectId) fetchProject(projectId);
  }, [projectId])

  return (
    <div className='p-2'>
      <div className='flex items-center'>
        <h2 className="text-lg mr-4">{project?.title}</h2>
        <IconMenu>
          <MenuItem>
            <EditProjectForm project={project} />
          </MenuItem>
          <MenuItem>
            <DeleteProjectButton project={project}/>
          </MenuItem>
        </IconMenu>
      </div>
      <SectionIndex />
    </div>
  )
}

export default ProjectTaskPage;
