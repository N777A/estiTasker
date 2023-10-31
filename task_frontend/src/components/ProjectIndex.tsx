import Link from "next/link"
import { useEffect, useState } from "react";
import { ProjectType, ApiResponseProjectType } from '../types/Project';
import apiClient from "../apiClient";
import CreateProjectForm from '@/src/components/CreateProjectForm';

const ProjectIndex: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get<ApiResponseProjectType>('http://localhost:3000/projects')
      setProjects(res.data.projects)
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  const addNewProject = (newProject: ProjectType) => {
    setProjects((prev) => [...prev!, newProject])
  }

  return(
    <div>
      <h1>ダッシュボード</h1>
      <button onClick={()=> setShowForm((prev)=> !prev)}>新しいProjectを作成</button>
      {showForm && 
      <CreateProjectForm 
        onAdd={addNewProject}
        toggleFormVisibility={setShowForm} 
      />}
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
