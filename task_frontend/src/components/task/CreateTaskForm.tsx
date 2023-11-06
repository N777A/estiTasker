import apiClient from "@/src/apiClient";
import { useState } from "react";

const CreateTaskForm: React.FC = ({ sectionId, toggleFormVisibility, onAdd }) => {
  const [title, setTitle] = useState('');

  const submitTask = async (e) => {
    e.preventDefault()
    try {
      console.log('送信')
      const {data} = await apiClient.post(`http://localhost:3000/sections/${sectionId}/tasks`, {
        'task': {
          'title': title
        }
      });
        onAdd(data)
        setTitle('');
        toggleFormVisibility(false)
    } catch(error) {
      console.error(error);
    }
  }

  return(
    <form onSubmit={submitTask}>
      <input
        type='text'
        placeholder="タスク名を入力"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </form>
    
  )
}

export default CreateTaskForm;
