import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ProjectType } from '@/src/types/Project';
import apiClient from '@/src/apiClient';

const Home: NextPage = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    try {
apiClient
      const res = await apiClient.get<ProjectType[]>('http://localhost:3000/projects')
      setProjects(res.data)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [])
  return (
    <div>
      <h1>ダッシュボード</h1>
      {/* {projects.map((project) => (
        <p>
          {project.title}
        </p>
      ))} */}
    </div>
  )
}

export default Home
