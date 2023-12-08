import useSections from "@/src/hooks/useSections";
import { DeleteSectionButtonProps } from "../../types/Section";
import { UniqueIdentifier } from "@dnd-kit/core";
import React from "react";

export type DeleteSectionProps = {
  sectionId: UniqueIdentifier,
}
const DeleteSectionButton: React.FC<DeleteSectionProps> = ({ sectionId }) => {
  const { deleteSection }  = useSections();
  const handleDelete = async () => {
    if (!confirm('セクションを削除した場合、所属するタスクも削除されますがよろしいですか？')) {
      return;
    }
    deleteSection(sectionId)
  }
  return(
    <button onClick={handleDelete}>セクションを削除</button>
  )
}

export default DeleteSectionButton;
