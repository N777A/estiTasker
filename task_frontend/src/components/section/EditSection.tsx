import { useCallback, useEffect, useRef, useState } from "react";
import { SectionTitleEditorProps } from "../../types/Section";
import apiClient from "@/src/apiClient";

const EditSection: React.FC<SectionTitleEditorProps> = ({ sectionId, initialTitle, onSave, onTitleChange }) => {
  const [editingTitle, setEditingTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const submitEditSection = async (e: any) => {
    e.preventDefault();
    try {
      await apiClient.put(`http://localhost:3000/sections/${sectionId}`, {
        'section': {
          'title': editingTitle
        }
      });
      onTitleChange(sectionId, editingTitle)
      onSave(sectionId, editingTitle);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onSave(sectionId, "");
      }
    }
  }, [])
  return (
    <form onSubmit={submitEditSection}>
      <input
        ref={inputRef}
        autoFocus
        value={editingTitle}
        onChange={(e) => setEditingTitle(e.target.value)}
      />
    </form>
   
  )
}

export default EditSection;
