import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BLANK_SECTION } from "@/src/types/Section";
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import {
  CancelDrop,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
  DndContext,
  DragOverlay,
  DropAnimation,
  getFirstCollision,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  Modifiers,
  useDroppable,
  UniqueIdentifier,
  useSensors,
  useSensor,
  MeasuringStrategy,
  KeyboardCoordinateGetter,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  AnimateLayoutChanges,
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  SortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';

import { Item, Container, ContainerProps } from './components';
import useSections from '@/src/hooks/useSections';

export default {
  title: 'Presets/Sortable/Multiple Containers',
};

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function DroppableContainer({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  ...props
}: ContainerProps & {
  disabled?: boolean;
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  style?: React.CSSProperties;
}) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'container',
      children: items,
    },
    animateLayoutChanges,
  });
  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'container') ||
    items.includes(over.id)
    : false;
  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  );
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;

interface Props {
  adjustScale?: boolean;
  cancelDrop?: CancelDrop;
  columns?: number;
  containerStyle?: React.CSSProperties;
  coordinateGetter?: KeyboardCoordinateGetter;
  getItemStyles?(args: {
    value: UniqueIdentifier;
    index: number;
    overIndex: number;
    isDragging: boolean;
    containerId: UniqueIdentifier;
    isSorting: boolean;
    isDragOverlay: boolean;
  }): React.CSSProperties;
  wrapperStyle?(args: { index: number }): React.CSSProperties;
  itemCount?: number;
  items?: Items;
  handle?: boolean;
  renderItem?: any;
  strategy?: SortingStrategy;
  modifiers?: Modifiers;
  minimal?: boolean;
  trashable?: boolean;
  scrollable?: boolean;
  vertical?: boolean;
}

export const TRASH_ID = 'void';
const PLACEHOLDER_ID = 'placeholder';
const empty: UniqueIdentifier[] = [];

export function MultipleContainers({
  adjustScale = false,
  cancelDrop,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  scrollable,
}: Props) {
  const [items, setItems] = useState<Items>(initialItems ?? {});
  const [containers, setContainers] = useState(
    Object.keys(items) as UniqueIdentifier[]
  );
  const { getSection, addSection, deleteSection, updateSection, getTask, updateTask, deleteTask } = useSections();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const isSortingContainer = activeId ? containers.includes(activeId) : false;

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in items) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.id in items
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);
      const intersections =
        pointerIntersections.length > 0
          ?
          pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId === TRASH_ID) {
          return intersections;
        }

        if (overId in items) {
          const containerItems = items[overId];

          if (containerItems.length > 0) {
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, items]
  );
  const [clonedItems, setClonedItems] = useState<Items | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );
  const findContainer = (id: UniqueIdentifier) => {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const getIndex = (id: UniqueIdentifier) => {
    const container = findContainer(id);

    if (!container) {
      return -1;
    }

    const index = items[container].indexOf(id);

    return index;
  };

  const onDragCancel = () => {
    if (clonedItems) {

      setItems(clonedItems);
    }

    setActiveId(null);
    setClonedItems(null);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, [items]);

  useEffect(() => {
    setItems(initialItems || {});
    setContainers(Object.keys(initialItems || {}).sort(
      (sectionIdA, sectionIdB) => (getSection(sectionIdA)?.position || 0) - (getSection(sectionIdB)?.position || 0)
    ) as UniqueIdentifier[])
  }, [initialItems]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        setClonedItems(items);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;

        if (overId == null || overId === TRASH_ID || active.id in items) {
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

            recentlyMovedToNewContainer.current = true;

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
      }}
      onDragEnd={({ active, over }) => {
        if (active.id in items && over?.id) {
          const activeIndex = containers.indexOf(active.id);
          const overIndex = containers.indexOf(over.id);
          let section = getSection(active.id)
          if (section) {
            if (overIndex === 0) {
              section.position = (getSection(containers.at(0) || 0)?.position || 0) - 1
            } else if (overIndex === containers.length - 1) {
              section.position = (getSection(containers.at(containers.length - 1) || 0)?.position || 0) + 1
            } else {
              let prevItem = getSection(containers.at(activeIndex > overIndex ? overIndex - 1 : overIndex) || 0)
              let nextItem = getSection(containers.at(activeIndex > overIndex ? overIndex : overIndex + 1) || 0)
              section.position = ((prevItem?.position || 0) + (nextItem?.position || 0)) / 2
            }
            updateSection(section)
          }

          setContainers((containers) => {
            const activeIndex = containers.indexOf(active.id);
            const overIndex = containers.indexOf(over.id);

            return arrayMove(containers, activeIndex, overIndex);
          });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        const overId = over?.id;

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overId === TRASH_ID) {
          setItems((items) => ({
            ...items,
            [activeContainer]: items[activeContainer].filter(
              (id) => id !== activeId
            ),
          }));
          setActiveId(null);
          return;
        }

        if (overId === PLACEHOLDER_ID) {
          const newContainerId = getNextContainerId();

          unstable_batchedUpdates(() => {
            setContainers((containers) => [...containers, newContainerId]);
            setItems((items) => ({
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (id) => id !== activeId
              ),
              [newContainerId]: [active.id],
            }));
            setActiveId(null);
          });
          return;
        }

        const overContainer = findContainer(overId);

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id);
          const overIndex = items[overContainer].indexOf(overId);

          let task = getTask(active.id)
          const newContainer = typeof overContainer === 'string' ? parseInt(overContainer) : overContainer;
          if (task && (activeIndex !== overIndex || task.section_id !== newContainer)) {
            task.section_id = newContainer;
            if (overIndex === 0) {
              task.position = (getTask(items[overContainer].at(0) || 0)?.position || 0) - 1
            } else if (overIndex === items[overContainer].length - 1) {
              task.position = (getTask(items[overContainer].at(items[overContainer].length - 1) || 0)?.position || 0) + 1
            } else {
              let prevItem = getTask(items[overContainer].at(activeIndex > overIndex ? overIndex - 1 : overIndex) || 0)
              let nextItem = getTask(items[overContainer].at(activeIndex > overIndex ? overIndex : overIndex + 1) || 0)
              task.position = ((prevItem?.position || 0) + (nextItem?.position || 0)) / 2
            }
            updateTask(task)
          }

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

        setActiveId(null);
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: 'inline-grid',
          boxSizing: 'border-box',
          padding: 20,
          gridAutoFlow: vertical ? 'row' : 'column',
          maxHeight: 'calc(100vh - 5rem)',
          overflowY: 'auto',
          width: '100%'
        }}
      >
        <SortableContext
          items={[...containers, PLACEHOLDER_ID]}
          strategy={
            vertical
              ? verticalListSortingStrategy
              : horizontalListSortingStrategy
          }
        >
          {containers.map((containerId) => (
            <DroppableContainer
              key={containerId}
              id={containerId}
              sectionId={containerId}
              columns={columns}
              items={items[containerId]}
              scrollable={scrollable}
              style={containerStyle}
              unstyled={minimal}
              onRemove={() => handleRemove(containerId)}
            >
              <SortableContext items={items[containerId]} strategy={strategy}>
                {items[containerId].map((value, index) => {
                  return (
                    <SortableItem
                      disabled={isSortingContainer}
                      key={value}
                      id={value}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={containerId}
                      getIndex={getIndex}
                      onRemove={() => handleRemoveTask(containerId, value)}
                    />
                  );
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
          {minimal ? undefined : (
            <DroppableContainer
              id={PLACEHOLDER_ID}
              disabled={isSortingContainer}
              items={empty}
              onClick={handleAddColumn}
              placeholder
            >
              + セクションを追加
            </DroppableContainer>
          )}
        </SortableContext>
      </div>
      {typeof document !== 'undefined' && createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {activeId
            ? containers.includes(activeId)
              ? renderContainerDragOverlay(activeId)
              : renderSortableItemDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
      {trashable && activeId && !containers.includes(activeId) ? (
        <Trash id={TRASH_ID} />
      ) : null}
    </DndContext>
  );

  function renderSortableItemDragOverlay(id: UniqueIdentifier) {
    return (
      <Item
        value={id}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id) as UniqueIdentifier,
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    );
  }

  function renderContainerDragOverlay(containerId: UniqueIdentifier) {
    return (
      <Container
        sectionId={containerId}
        columns={columns}
        style={{
          height: '100%',
        }}
        shadow
        unstyled={false}
      >
        {items[containerId].map((item, index) => (
          <Item
            key={item}
            value={item}
            handle={handle}
            style={getItemStyles({
              containerId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(item)}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    );
  }

  async function handleRemove(containerID: UniqueIdentifier) {
    try {
      deleteSection(containerID);
      setContainers((containers) =>
        containers.filter((id) => id !== containerID)
      )
    } catch (err) {
      console.log(err)
    }
  }

  async function handleRemoveTask(containerID: UniqueIdentifier, itemID: UniqueIdentifier) {
    try {
      deleteTask(containerID, itemID);
      setItems((items) => {
        items[containerID] = items[containerID].filter((id) => id !== itemID)
        return items
      })
    } catch (err) {
      console.log(err)
    }
  }

  function handleAddColumn() {

    const maxPosition: number = getSection(containers.at(containers.length - 1) || 0)?.position || 0;

    const newPosition = maxPosition + 1
    const newSection = {
      ...JSON.parse(JSON.stringify(BLANK_SECTION)),
      position: newPosition
    }
    addSection(newSection)
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items);
    // TODO: バックエンドから新しいセクションを作成

    return containerIds.length
  }
}

function getColor(id: UniqueIdentifier) {
  switch (String(id)[0]) {
    case 'A':
      return '#7193f1';
    case 'B':
      return '#ffda6c';
    case 'C':
      return '#00bcd4';
    case 'D':
      return '#ef769f';
  }

  return undefined;
}

function Trash({ id }: { id: UniqueIdentifier }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        left: '50%',
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: '1px solid',
        borderColor: isOver ? 'red' : '#DDD',
      }}
    >
      Drop here to delete
    </div>
  );
}

interface SortableItemProps {
  containerId: UniqueIdentifier;
  id: UniqueIdentifier;
  index: number;
  handle: boolean;
  disabled?: boolean;
  style(args: any): React.CSSProperties;
  getIndex(id: UniqueIdentifier): number;
  renderItem(): React.ReactElement;
  wrapperStyle({ index }: { index: number }): React.CSSProperties;
  onRemove: () => void;
}

function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  style,
  containerId,
  getIndex,
  wrapperStyle,
  onRemove,
}: SortableItemProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
  });
  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
      onRemove={onRemove}
    />
  );
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}
