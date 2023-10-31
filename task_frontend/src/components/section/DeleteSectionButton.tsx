import apiClient from "../../apiClient";
import { DeleteSectionButtonProps } from "../../types/Section";

const DeleteSectionButton:React.FC<DeleteSectionButtonProps> = ({ sectionId, onDelete }) => {
  const handleDelete = async () => {
    if (!confirm('セクションを削除した場合、所属するタスクも削除されますがよろしいですか？')) {
      return;
    }

    try {
      await apiClient.delete(`http://localhost:3000/sections/${sectionId}`)
      onDelete(sectionId)
    } catch (error) {
      console.error(error);
    }
  }

  return(
    <button onClick={handleDelete}>セクションを削除</button>
  )
}

export default DeleteSectionButton;
