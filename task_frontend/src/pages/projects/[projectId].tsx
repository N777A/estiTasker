import apiClient from "@/src/apiClient";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { ProjectType } from "@/src/types/Project";
import SectionIndex from "@/src/components/section/SectionIndex";
import EditProjectForm from "@/src/components/project/EditProjectForm";
import DeleteProjectButton from "@/src/components/project/DeleteProjectButton";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const divRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<ProjectType | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [toggleEditForm, setToggleEditForm] = useState(false);

  const fetchProject = async () => {
    if (projectId) {
      try {
        const res = await apiClient.get<ProjectType>(`http://localhost:3000/projects/${projectId}`);
        setProject(res.data);
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchProject();
  }, [projectId])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
        setToggleEditForm(false)
      }
    }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [divRef, showDropdown])
  return(
    <div className='project-page-container'>
      <div className='project-info-container'>
        <h2>{project?.title}</h2>
        <button onClick={() => setShowDropdown(prev => !prev)}>▽</button>
        {showDropdown && (
          <div className='dropdown-menu' ref={divRef} >
            <button onClick={() => setToggleEditForm(prev => !prev)}>
              Projectを編集する
            </button>
            {toggleEditForm && <EditProjectForm />}
            <DeleteProjectButton />
          </div>
        )}
      </div>
      <SectionIndex />
    </div>
  )
}

export default ProjectTaskPage;
