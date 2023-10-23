import apiClient from "@/src/apiClient";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectType } from "@/src/types/Project";
import { SectionType, CreateSectionFormProps } from "@/src/types/Section";
import CreateSectionForm from "@/src/components/CreateSectionForm";
import { ApiResponseSectionType } from '../../types/Section'


const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<ProjectType | null>(null);
  const [sections, setSections] = useState<SectionType[] | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const fetchProject = async () => {
    if (projectId) {
      try {
        const res = await apiClient.get<ProjectType>(`http://localhost:3000/projects/${projectId}`);
        setProject(res.data);
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fetchSection = async () => {
    try {
      const res = await apiClient.get<ApiResponseSectionType>(`http://localhost:3000/projects/${projectId}`);
      setSections(res.data.sections)
  
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProject();
  }, [projectId])

  useEffect(() => {
    fetchSection();
  }, [])

  return(
    <div className='project-page-container'>
      <div className='project-info-container'>
        <h2>{project?.title}</h2>
        <button>▽</button>
      </div>
      <div className='task-list-container'>
        <button onClick={() => setShowSectionForm(prev => !prev)}>セクションを追加</button>
        {showSectionForm && project && <CreateSectionForm projectId={project.id}/>}
        <ul>
          {sections && sections.map((section) => (
            <>
              <li key={section.id}>{section.title}</li>
            </>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectTaskPage;
