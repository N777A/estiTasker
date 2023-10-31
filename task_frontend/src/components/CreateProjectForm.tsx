import { ChangeEvent, EventHandler, useEffect, useRef, useState } from "react";
import apiClient from "../apiClient";
import { CreateProjectFormProps, ProjectType } from "../types/Project";

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onAdd, toggleFormVisibility }) => {
  const [formData, setFormData] = useState<ProjectType>({ title: '', description: '', icon: '' });
  const divRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('http://localhost:3000/projects', { project: formData })
      
      onAdd(res.data)
      setFormData({ title: '', description: '', icon: '' });
      toggleFormVisibility(false)
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        toggleFormVisibility(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [toggleFormVisibility])

  return (
    <div ref={divRef}>
      <form onSubmit={handleSubmit}>
        <label>New Project</label>
        <input 
          type="text"
          name="title"
          placeholder="タイトル"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="説明"
          value={formData.description}
          onChange={handleChange}
        />
        <button type='submit'>
          Projectを作成
        </button>
      </form>
    </div>
  )
}

export default CreateProjectForm;
