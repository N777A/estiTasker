import apiClient from "@/src/apiClient";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectType } from "@/src/types/Project";
import SectionIndex from "@/src/components/SectionIndex";
import EditProjectFormButton from "@/src/components/EditProjectFormButton";
import DeleteProjectButton from "@/src/components/DeleteProjectButton";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  console.log(`router.query⭐️${router.query.projectId}`);

  const [project, setProject] = useState<ProjectType | null>(null);
  const [showDropdown, setShowDorpdown] = useState(false);
  
  const fetchProject = async () => {
    if (projectId) {
      try {
        const res = await apiClient.get<ProjectType>(`http://localhost:3000/projects/${projectId}`);
        setProject(res.data);
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchProject();
    console.log('fetch Project!')
  }, [projectId])

  return(
    <div className='project-page-container'>
      <div className='project-info-container'>
        <h2>{project?.title}</h2>
        <button onClick={() => setShowDorpdown(prev => !prev)}>▽</button>
        {showDropdown && (
          <div className='dropdown-menu'>
            <EditProjectFormButton />
            <DeleteProjectButton />
          </div>
        )}
      </div>
      <SectionIndex />
    </div>
  )
}

export default ProjectTaskPage;
