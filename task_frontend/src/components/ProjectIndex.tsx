import Link from "next/link"
import { useEffect, useState } from "react";
import { ProjectType, ApiResponseProjectType } from '../types/Project';
import apiClient from "../apiClient";

const ProjectIndex: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get<ApiResponseProjectType>('http://localhost:3000/projects')
      setProjects(res.data.projects)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  return(
    <div>
      <h1>ダッシュボード</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`}>
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectIndex;
