import { useRouter } from "next/router";
import apiClient from "../../apiClient";

const DeleteProjectButton:React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query

  const handleDelete = async () => {
    if (!confirm('本当にProjectを削除しますか？Projectが削除されるとタスクも全て削除されます。')){
      return;
    }

    try {
      await apiClient.delete(`http://localhost:3000/projects/${projectId}`)

      router.push('/projects')
    } catch(error) {
      console.error(error)
    }
  }

  return (
    <button onClick={handleDelete}>Projectを削除</button>
  )
}

export default DeleteProjectButton;
