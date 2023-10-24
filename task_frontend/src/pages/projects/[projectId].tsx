import apiClient from "@/src/apiClient";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectType } from "@/src/types/Project";
import CreateSectionForm from "@/src/components/CreateSectionForm";
import { ApiResponseSectionType } from '../../types/Section'
import SectionIndex from "@/src/components/SectionIndex";


const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  console.log(`router.query⭐️${router.query.projectId}`);

  const [project, setProject] = useState<ProjectType | null>(null);
  
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
        <button>▽</button>
      </div>
      <SectionIndex />
    </div>
  )
}

export default ProjectTaskPage;
