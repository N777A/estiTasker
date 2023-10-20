import type { NextPage } from 'next';
import { useState } from 'react';
import CreateProjectForm from '@/src/components/CreateProjectForm';
import ProjectIndex from '@/src/components/ProjectIndex';

const Projects: NextPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={()=> setShowForm((prev)=> !prev)}>新しいProjectを作成</button>
      {showForm && <CreateProjectForm />}
      <ProjectIndex />
    </div>
  )
}

export default Projects;
