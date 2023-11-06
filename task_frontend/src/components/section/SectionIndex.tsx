import { BLANK_SECTION, SectionType, cloneSections } from "@/src/types/Section";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSections from "@/src/hooks/useSections";
import SectionContainer from "./SectionContainer";
import TaskItem from "../task/TaskItem";
import { Button, MenuItem } from "@mui/material";
import { BLANK_TASK } from "@/src/types/Task";
import ButtonMenu from "../common/ButtonMenu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const SectionIndex: React.FC = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string) || -1;
  const { sections, fetchSections, addSection } = useSections();
  const [_sections, setSections] = useState(cloneSections(sections));

  // Sortable
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );
  // const handleDragEnd = (event: any) => {
  //   const { active, over } = event;
  //   if (active.id !== over.id) {
  //     const currentItems = Array.from(_sections.entries());
  //     const itemIndex = currentItems.findIndex(([key, _]) => key === active.id);
  //     const newIndex = currentItems.findIndex(([key, _]) => key === over.id);
  //     if (itemIndex > -1 && newIndex < currentItems.length) {
  //       const [item] = currentItems.splice(itemIndex, 1);
  //       currentItems.splice(newIndex, 0, item);
  //     }
  //     setSections(new Map<number, SectionType>(currentItems));
  //   }
  // }

  useEffect(() => {
    if (!router.isReady) return;
    if (projectId) {
      fetchSections(projectId);
    }
  }, [router.isReady])

  useEffect(() => {
    console.log("clone")
    setSections(cloneSections(sections))
  }, [sections])

  useEffect(() => {
    console.log("cloned")
  }, [_sections])

  const addBlankTask = (sectionId?: number) => {
    const _section = sectionId !== undefined ? _sections.get(sectionId) : _sections.values().next().value
    if (_section !== undefined) {
      _section.tasks.set(-1, { ...BLANK_TASK, sectionId: sectionId })
      setSections(new Map<number, SectionType>(_sections))
    }
  }

  const removeBlankTask = (sectionId: number, taskId: number) => {
    const _section = _sections.get(sectionId)
    if (_section !== undefined) {
      _section.tasks.delete(taskId)
      setSections(new Map<number, SectionType>(_sections))
    }
  }

  const addBlankSection = () => {
    const _section = JSON.parse(JSON.stringify(BLANK_SECTION))
    addSection(_section, projectId)
  }

  return (
    <div className='task-list-container'>
      <ButtonMenu label="新規作成">
        {sections.size > 0 && <MenuItem onClick={() => addBlankTask()}>タスクを作成</MenuItem>}
        <MenuItem onClick={() => addBlankSection()}>セクションを作成</MenuItem>
      </ButtonMenu>
      {_sections && Array.from(_sections.values()).map((section) => (
        <div key={section.id}>
          <SectionContainer projectId={projectId} section={section}>
            {/* <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={Array.from(section.tasks.values())}
                strategy={verticalListSortingStrategy}
              > */}
                <div>
                  {section.tasks && Array.from(section.tasks.values()).map((task, idx) => (
                    <TaskItem key={idx} sectionId={section.id} task={task} removeBlankTask={removeBlankTask}></TaskItem>
                  ))}
                </div>
              {/* </SortableContext>
            </DndContext> */}
            <div className="p-2">
              <Button onClick={() => addBlankTask(section.id)}>タスクを追加</Button>
            </div>
          </SectionContainer>
        </div>
      ))}
    </div>
  )
}

export default SectionIndex;
