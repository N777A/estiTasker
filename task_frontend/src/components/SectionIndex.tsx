import { SectionType } from "@/src/types/Section";
import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";
import CreateSectionForm from "./CreateSectionForm";

const SectionIndex = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const [sections, setSections] = useState<SectionType[] | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);


  const fetchSection = async () => {
    try {
      const res = await apiClient.get<SectionType[]>(`http://localhost:3000/projects/${projectId}/sections`);
      setSections(res.data)
  
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!router.isReady) return;
      fetchSection();
      console.log('fetch sections')
  }, [router.isReady])

  return (
    <div className='task-list-container'>
        <button onClick={() => setShowSectionForm(prev => !prev)}>セクションを追加</button>
        {showSectionForm && <CreateSectionForm />}
        <ul>
          {sections && sections.map((section) => (
              <li key={section.id}>{section.title}</li>
          ))}
        </ul>
      </div>
  )
}

export default SectionIndex;
