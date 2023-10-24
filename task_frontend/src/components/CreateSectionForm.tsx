import { useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";

const CreateSectionForm: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [title, setTitle] = useState('')
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`http://localhost:3000/projects/${projectId}/sections`, {
        sections: {
          title
        }
      });

      setTitle('')

      window.location.reload();
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
