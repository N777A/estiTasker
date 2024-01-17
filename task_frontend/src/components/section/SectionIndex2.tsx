import useSections from "@/src/hooks/useSections";
import { MultipleContainers } from "../dnd/MultipleContainers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Items, sections2items } from "@/src/types/Section";
import AutoTaskCreatorForm from "../Llm/AutoTaskCreatorForm";

const SectionIndex: React.FC = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string) || -1;
  const { currentProjectId, sections, fetchSections, addSection } = useSections();
  const [items, setItems] = useState<Items>(sections2items(sections));

  useEffect(() => {
    if (!router.isReady) return;
    if (projectId && currentProjectId != projectId) {
      fetchSections(projectId);
    }
  }, [router.isReady, projectId])

  useEffect(() => {
    setItems(sections2items(sections));
    console.log(sections)
  }, [sections])

  return (
    <>
      <MultipleContainers
        items={items}
        handle
        vertical
      />
    </>
  )
}

export default SectionIndex;
