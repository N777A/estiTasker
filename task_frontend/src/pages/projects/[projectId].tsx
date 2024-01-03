import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";
import SectionIndex from "@/src/components/section/SectionIndex2";
import EditProjectForm from "@/src/components/project/EditProjectForm";
import DeleteProjectButton from "@/src/components/project/DeleteProjectButton";
import IconMenu from "@/src/components/common/IconMenu";
import { MenuItem } from "@mui/material";
import useProjects from "@/src/hooks/useProjects";
import { useLlm } from "@/src/hooks/useLlm";
import CatCommentTop from "@/src/components/Llm/CatCommentTop";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const projectId: number = parseInt(router.query.projectId as string)
  const { project, fetchProject } = useProjects();
  const { createTasks } = useLlm;

  useEffect(() => {
    if (projectId) fetchProject(projectId);
  }, [projectId])

  const testAuto = async () => {
    try {
      const res = await createTasks('AI小説作成アプリの開発')
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='p-2'>
      <div className='flex items-center'>
        <h2 className="text-lg mr-4">{project?.title}</h2>
        <IconMenu>
          <MenuItem>
            <EditProjectForm project={project} />
          </MenuItem>
          <MenuItem>
            <DeleteProjectButton project={project} />
          </MenuItem>
          <button onClick={testAuto}>＊</button>
        </IconMenu>
      </div>
      <CatCommentTop />
      <SectionIndex />
      {/* <small>Icon by icons8.com</small> */}
    </div>
  )
}

export default ProjectTaskPage;
