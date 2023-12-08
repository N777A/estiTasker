import { BLANK_SECTION, Items, SectionType, cloneSections, sections2items } from "@/src/types/Section";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSections from "@/src/hooks/useSections";
import SectionContainer from "./SectionContainer";
import TaskItem from "../task/TaskItem";
import { Button, MenuItem } from "@mui/material";
import { BLANK_TASK, TaskType } from "@/src/types/Task";
import ButtonMenu from "../common/ButtonMenu";
import {
  DndContext,
  closestCenter,
  MouseSensor as LibMouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { toInteger } from "lodash";

const SectionIndex: React.FC = () => {
  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string) || -1;
  // section のコピー
  const { sections, fetchSections, addSection, reorderSection } = useSections();
  // Sortable のための位置情報
  const [items, setItems] = useState<Items>(sections2items(sections));
  const [containers, setContainers] = useState(Array.from(sections.keys()) as UniqueIdentifier[]);
  // _section に section を渡した際にシャローコピーになるので、cloneSections で Json に変換し、別の配列となるように処理している
  const [_sections, setSections] = useState(cloneSections(sections));

  // Sortable
  class MouseSensor extends LibMouseSensor {
    static activators = [
      {
        eventName: "onMouseDown" as const,
        handler: ({ nativeEvent: event }: MouseEvent): boolean => {
          return shouldHandleEvent(event.target as HTMLElement);
        },
      },
    ];
  }
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer || !activeContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer];
        const overItems = items[overContainer];
        const overIndex = overItems.indexOf(overId);
        const activeIndex = activeItems.indexOf(active.id);

        let newIndex: number;

        if (overId in items) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top >
            over.rect.top + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(
              newIndex,
              items[overContainer].length
            ),
          ],
        };
      });
    }
  }
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id);
        const overIndex = containers.indexOf(over.id);

        return arrayMove(containers, activeIndex, overIndex);
      });
    }

    const activeContainer = findContainer(active.id);

    if (!activeContainer) {
      // setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      // setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id);
      const overIndex = items[overContainer].indexOf(overId);

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    // setActiveId(null);
  }

  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (projectId) {
      fetchSections(projectId);
    }
  }, [router.isReady])

  useEffect(() => {
    console.log("clone")
    setSections(cloneSections(sections))
    setItems(sections2items(sections));
    setContainers(Array.from(sections.keys()) as UniqueIdentifier[]);
  }, [sections])

  useEffect(() => {
    console.log("cloned", _sections)
  }, [_sections])

  // useEffect(() => {
  //   console.log("cloned", containers)
  // }, [containers])

  const addBlankTask = (sectionId?: UniqueIdentifier) => {
    console.log("add blank task")
    // Section の取得：sectionId なしだったら最初のセクション
    if (sectionId === undefined) {
      sectionId = containers[0]
    }
    const _section = _sections.get(sectionId)
    console.log(_section);
    // Section にタスクを追加
    if (_section !== undefined) {
      _section.tasks.set(-1, { ...BLANK_TASK, section_id: toInteger(sectionId) })
      setSections(new Map<UniqueIdentifier, SectionType>(_sections))
      items[sectionId].push(-1)
      setItems(JSON.parse(JSON.stringify(items)))
      console.log(items)
    }
  }

  const removeBlankTask = (sectionId: UniqueIdentifier, taskId: UniqueIdentifier) => {
    const _section = _sections.get(sectionId)
    if (_section !== undefined) {
      _section.tasks.delete(taskId)
      setSections(new Map<UniqueIdentifier, SectionType>(_sections))
    }
  }

  const addBlankSection = () => {
    const _section = JSON.parse(JSON.stringify(BLANK_SECTION))
    addSection(_section, projectId)
  }

  function shouldHandleEvent(element: HTMLElement | null) {
    let cur = element;

    while (cur) {
      if (cur.dataset && cur.dataset.dndkitDisabledDndFlag) {
        return false;
      }
      cur = cur.parentElement;
    }

    return true;
  }

  return (
    <div className='task-list-container'>
      <ButtonMenu label="新規作成">
        {sections.size > 0 && <MenuItem onClick={() => addBlankTask()}>タスクを作成</MenuItem>}
        <MenuItem onClick={() => addBlankSection()}>セクションを作成</MenuItem>
      </ButtonMenu>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={containers}
          strategy={rectSortingStrategy}
        >
          {containers.map((containerId) => (
            _sections.get(containerId) && (
              <SectionContainer key={containerId} projectId={projectId} section={sections.get(containerId) || BLANK_SECTION}>
                <SortableContext
                  items={items[containerId]}
                  strategy={rectSortingStrategy}
                >
                  {items[containerId].map((taskId, idx) => (
                    <TaskItem key={idx} sectionId={containerId} task={sections.get(containerId)?.tasks.get(taskId) || BLANK_TASK} removeBlankTask={removeBlankTask}></TaskItem>
                  ))}
                </SortableContext>
                <div className="p-2">
                  <Button onClick={() => addBlankTask(containerId)} data-dndkit-disabled-dnd-flag="true">タスクを追加</Button>
                </div>
              </SectionContainer>
            )
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default SectionIndex;
