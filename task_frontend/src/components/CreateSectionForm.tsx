import { useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";
import { CreateSectionFormProps } from "../types/Section";

const CreateSectionForm: React.FC<CreateSectionFormProps> = ({ onAdd }) => {
  const router = useRouter();
  const { projectId } = router.query;
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(`http://localhost:3000/projects/${projectId}/sections`, {
        'section': {
          'title': title
        }
      });

      onAdd(response.data)
      setTitle('')
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>セクションフォーム</h1>
      <form
        onSubmit={handleSubmit}
      >
        <input 
          type='text'
          placeholder="新規のセクション"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </div>
  )
}

export default CreateSectionForm;
