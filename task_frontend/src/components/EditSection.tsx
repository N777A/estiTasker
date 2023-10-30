import { useCallback, useEffect, useRef, useState } from "react";

type SectionTitleEditorProps = {
  sectionId: number;
  initialTitle: string;
  onSave: (sectionId: number, newTitle: string) => Promise<void>
  onFinishEditing: () => void;
  onTitleChange: (sectionId: number, newTitle: string) => void;
};

const EditSection: React.FC<SectionTitleEditorProps> = ({ sectionId, initialTitle, onSave, onFinishEditing, onTitleChange }) => {
  const [editingTitle, setEditingTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('initialTitle changed', initialTitle)
    setEditingTitle(initialTitle);
  }, [initialTitle])

  const handleFinishEditing = async () => {
    await onSave(sectionId, editingTitle);
    onFinishEditing();
  }

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
      onChange={(e) => {
        console.log('onChange')
        setEditingTitle(e.target.value);
        onTitleChange(sectionId, e.target.value)
      }}
      onKeyDown={(e) => {
        console.log('onKeydown', e.key)
        if (e.key === 'Enter') {
          handleFinishEditing()
        }
      }}
  />
  )
}

export default EditSection;
