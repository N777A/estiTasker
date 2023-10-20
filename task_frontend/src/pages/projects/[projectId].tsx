import apiClient from "@/src/apiClient";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectType } from "@/src/types/Project";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    if (projectId) {
      (async () => {
        try {
          const res = await apiClient.get(`http://localhost:3000/projects/${projectId}`);
          setProject(res.data);
          console.log(`データ⭐️`, res.data);
        } catch (error) {
          console.log(error);
        }  
      })();
    }
  }, [projectId]);

  return(
    <div className='project-page-container'>
      <div className='project-info-container'>
        <h2>{project?.title}</h2>
        <button>▽</button>
      </div>
      <div className='task-list-container'>
        
      </div>
    </div>
  )
}

export default ProjectTaskPage;
