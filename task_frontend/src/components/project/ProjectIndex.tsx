import Link from "next/link"
import { useEffect } from "react";
import CreateProjectForm from '@/src/components/project/CreateProjectForm';
import useProjects from "@/src/hooks/useProjects";
import { List, ListItem, ListItemButton } from "@mui/material";

const ProjectIndex: React.FC = () => {
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <div className="p-2">
      <div className="flex items-center">
        <h2 className="text-lg mr-4">プロジェクト一覧</h2>
        <CreateProjectForm />
      </div>
      <List>
        {Object.entries(projects).map(([_, project]) => (
          <ListItem key={project.id} disablePadding>
            <ListItemButton>
              <Link className="w-full" href={`/projects/${project.id}`}>
                {project.title}
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )
}

export default ProjectIndex;
