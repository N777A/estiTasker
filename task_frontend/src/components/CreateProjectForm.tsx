import { useEffect, useRef, useState } from "react";
import apiClient from "../apiClient";
import { CreateProjectFormProps } from "../types/Project";

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onAdd, toggleFormVisibility }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [status, setStatus] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('http://localhost:3000/projects', {
        project: {
          title,
          description,
          icon,
          status,
        }
      });
      
      onAdd(response.data)
      setTitle('')
      setDescription('')
      setIcon('')
      setStatus('')
      
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        toggleFormVisibility(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [toggleFormVisibility])

  return (
    <div ref={divRef}>
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
          onClick={() => toggleFormVisibility(false)}
        >
          Projectを作成
        </button>
      </form>
    </div>
  )
}

export default CreateProjectForm;
