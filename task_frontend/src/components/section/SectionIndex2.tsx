import useSections from "@/src/hooks/useSections";
import { MultipleContainers } from "../dnd/MultipleContainers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BLANK_SECTION, Items, sections2items } from "@/src/types/Section";
import { MenuItem } from "@mui/material";
import ButtonMenu from "../common/ButtonMenu";

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

  // const addBlankSection = () => {
  //   const maxPosition = Array.from(sections.values()).reduce((max, section) => {
  //     return Math.max(max, section.position);
  //   }, 0);

  //   const newPosition = maxPosition + 1
  //   const newSection = {
  //     ...JSON.parse(JSON.stringify(BLANK_SECTION)),
  //     position: newPosition
  //   }
  //   addSection(newSection, projectId)
  // }

  return (
    <>
      {/* <ButtonMenu label="新規作成">
        {sections.size > 0 && <MenuItem onClick={() => addBlankTask()}>タスクを作成</MenuItem>}
        <MenuItem onClick={() => addBlankSection()}>セクションを作成</MenuItem>
      </ButtonMenu> */}
      {/* <button onClick={() => console.log(sections)}>test</button> */}
      <MultipleContainers
        items={items}
        handle
        vertical
      />
    </>
  )
}

export default SectionIndex;
