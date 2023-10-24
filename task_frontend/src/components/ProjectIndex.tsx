import Link from "next/link"
import { useEffect, useState } from "react";
import { ProjectType, ApiResponseProjectType } from '../types/Project';
import apiClient from "../apiClient";
import EditProjectFormButton from "./EditProjectFormButton";
import DeleteProjectButton from "./DeleteProjectButton";

const ProjectIndex: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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
            <button onClick={() => setShowDropdown(prev => !prev)}>...</button>
            {showDropdown && (
              <div>
                <EditProjectFormButton />
                <DeleteProjectButton />
              </div>

            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProjectIndex;
