import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";

const EditProjectFormButton: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  const [showEditProjectForm, setShowEditProjectForm] = useState(false);


    const fetchProject = async () => {
      try {
        const res = await apiClient.get(`http://localhost:3000/projects/${projectId}`)

        const { title, description } = res.data;
        setTitle(title);
        setDescription(description)
      } catch(error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if (projectId) {
        fetchProject();
      }
    }, [projectId]) 

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await  apiClient.put(`http://localhost:3000/projects/${projectId}`, { project: { title, description }});

      } catch(error) {
        console.log(error)
      }
    }

  return(
    <div>
      <button onClick={() => setShowEditProjectForm(prev => !prev)}>Projectを編集する</button>
      { showEditProjectForm && (
      <form
        onSubmit={handleSubmit}
      >
        <button 
          type='submit'
          onClick={() => setShowEditProjectForm(false)}
        >
        ×
        </button>
        <label>Project編集</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
        />
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='説明'
        />
      </form>
      )}

    </div>
  )
}

export default EditProjectFormButton;
