import { useEffect, useRef, useState } from "react";
import apiClient from "../../apiClient";
import { useRouter } from "next/router";
import { CreateSectionFormProps } from "../../types/Section";

const CreateSectionForm: React.FC<CreateSectionFormProps> = ({ onAdd, toggleFormVisibility }) => {
  const router = useRouter();
  const { projectId } = router.query
  const [title, setTitle] = useState('');
  const divRef = useRef<HTMLDivElement>(null);

  const submitSection = async () => {
    if (!projectId) {
      console.error('Project ID is not defined')
      return;
    }
    try {
      const {data} = await apiClient.post(`http://localhost:3000/projects/${projectId}/sections`, {
        'section': {
          'title': title
        }
      });
      if (data) {
        onAdd(data);
        setTitle('');
        toggleFormVisibility(false)
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const handleClickOutSide = (e:MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        submitSection();
      }
    }

    document.addEventListener('mousedown', handleClickOutSide)
    return () => document.removeEventListener('mousedown', handleClickOutSide)
  }, [submitSection])

  return (
    <div ref={divRef}>
      <h1>セクションフォーム</h1>
        <input 
          type='text'
          placeholder="新規のセクション"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submitSection()}
        />
    </div>
  )
}

export default CreateSectionForm;
