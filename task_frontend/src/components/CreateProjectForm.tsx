import { useState } from "react";
import apiClient from "../apiClient";

const CreateProjectForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('http://localhost:3000/projects', {
        project: {
          title,
          description,
          icon,
          status,
        }
      });
      
      setTitle('')
      setDescription('')
      setIcon('')
      setStatus('')

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
      >
        <label>New Project</label>
        <input 
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          value={description}
          placeholder="説明"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type='submit'
        >
          Projectを作成
        </button>
      </form>
    </div>
  )
}

export default CreateProjectForm;
