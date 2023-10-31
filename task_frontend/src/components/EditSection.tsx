import { useCallback, useEffect, useRef, useState } from "react";
import { SectionTitleEditorProps } from "../types/Section";

const EditSection: React.FC<SectionTitleEditorProps> = ({ sectionId, initialTitle, onSave, onFinishEditing, onTitleChange }) => {
  const [editingTitle, setEditingTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditingTitle(initialTitle);
  }, [initialTitle])

  const handleFinishEditing = useCallback(async () => {
    await onSave(sectionId, editingTitle);
    onFinishEditing();
  }, [sectionId, editingTitle, onSave, onFinishEditing]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setEditingTitle(newTitle);
    onTitleChange(sectionId, newTitle);
  }, [sectionId, onTitleChange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        handleFinishEditing();
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingTitle, handleFinishEditing])

  return (
    <input
      ref={inputRef}
      autoFocus
      value={editingTitle}
      onChange={handleChange}
      onKeyDown={(e) => e.key === 'Enter' && handleFinishEditing()}
  />
  )
}

export default EditSection;
