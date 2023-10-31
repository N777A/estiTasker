import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";

const EditProjectForm: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    icon: '',
  })

  const fetchProject = async () => {
    try {
      const res = await apiClient.get(`http://localhost:3000/projects/${projectId}`)
      const { title, description } = res.data;
      setProjectData({ ...projectData, title, description })
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      await  apiClient.put(`http://localhost:3000/projects/${projectId}`, { project: projectData});
    } catch(error) {
      console.error(error)
    }
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <button type='submit'>
        ×
        </button>
        <label>Project編集</label>
        <input
          type='text'
          name='title'
          value={projectData.title}
          onChange={handleChange}
          placeholder="タイトル"
        />
        <textarea
          name='description'
          value={projectData.description}
          onChange={handleChange}
          placeholder='説明'
        />
      </form>
    </div>
  )
}

export default EditProjectForm;
