import { SectionType } from "@/src/types/Section";
import { useCallback, useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useRouter } from "next/router";
import CreateSectionForm from "./CreateSectionForm";
import EditSection from './EditSection'
import DeleteSectionButton from "./DeleteSectionButton";

const SectionIndex:React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [sections, setSections] = useState<SectionType[] | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [dropdownSectionId, setDropdownSectionId] = useState<number | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
    
  const fetchSection = useCallback(async () => {
    try {
      const res = await apiClient.get<SectionType[]>(`http://localhost:3000/projects/${projectId}/sections`);
      setSections(res.data)
    } catch(error) {
      console.error(error)
    }
  }, [projectId])

  useEffect(() => {
    if(!router.isReady) return;
      fetchSection();
  }, [router.isReady])

  const addNewSection = (newSection: SectionType) => {
    setSections(prev => [...prev!, newSection]);
  }

  const onSave = async (sectionId: number, newTitle: string) => {
    try {
      await apiClient.put(`http://localhost:3000/sections/${sectionId}`, {
        'section': {
          'title': newTitle
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  const onTitleChange = (sectionId: number, newTitle: string) => {
    setSections(prevSections => {
      if (!prevSections) return null;
      return prevSections.map(section => 
        section.id === sectionId ? { ...section, title: newTitle } : section
      );
    });
  };

  useEffect(() => {
    const handleClickCloseDropdown = (e: MouseEvent) => {
      if (dropdownSectionId != null && e.target instanceof Node) {
        const dropdownElement = document.getElementById(`dropdown-${dropdownSectionId}`);
        if (dropdownElement && !dropdownElement.contains(e.target)) {
          setDropdownSectionId(null);
        }
      }
    };
  
    document.addEventListener("mousedown", handleClickCloseDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickCloseDropdown);
    };
  }, [dropdownSectionId]);

  const onDelete = (sectionId: number) => {
    setSections((prev) => {
      const newSections = prev?.filter((section) => section.id !== sectionId);
      return newSections && newSections?.length > 0 ? newSections : null;
    });
  }

  return (
    <div className='task-list-container'>
        <button onClick={() => setShowSectionForm(prev => !prev)}>セクションを追加</button>
        {showSectionForm &&
          <CreateSectionForm
            onAdd={addNewSection} 
            toggleFormVisibility={setShowSectionForm}
          />
        }
        <ul>
          {sections && sections.map((section) => (
              <li key={section.id}>
                {editingSectionId === section.id ? (
                 <EditSection
                  sectionId={section.id}
                  initialTitle={section.title}
                  onSave={onSave}
                  onFinishEditing={() => setEditingSectionId(null)}
                  onTitleChange={onTitleChange}
                 />
                ) : (
                  section.title
                )}
                <button onClick={() => setDropdownSectionId(section.id)}>...</button>
                {dropdownSectionId === section.id && ( 
                  <div id={`dropdown-${section.id}`}>
                    <button onClick={() => {
                      setEditingSectionId(section.id)
                      setDropdownSectionId(null);
                    }}>
                      セクション名を変更
                    </button>
                    <DeleteSectionButton
                      sectionId={section.id}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </li>
          ))}
        </ul>
      </div>
  )
}

export default SectionIndex;
