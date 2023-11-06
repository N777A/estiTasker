import useProjects from "@/src/hooks/useProjects";
import { ProjectType } from "@/src/types/Project";
import { useRouter } from "next/router";

export type DeleteProjectFormProps = {
  project: ProjectType | undefined
}

const DeleteProjectButton:React.FC<DeleteProjectFormProps> = ({ project }) => {
  const router = useRouter();
  const { deleteProject } = useProjects()

  const handleDelete = async () => {
    if (!confirm('本当にProjectを削除しますか？Projectが削除されるとタスクも全て削除されます。')){
      return;
    }

    if (project?.id) {
      deleteProject(project?.id)
      router.push('/projects')
    }
  }

  return (
    <button onClick={handleDelete}>Projectを削除</button>
  )
}

export default DeleteProjectButton;
