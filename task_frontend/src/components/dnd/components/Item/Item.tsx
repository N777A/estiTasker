import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import { Action, Handle, Remove } from './components';
import styles from './Item.module.css';
import useSections from '@/src/hooks/useSections';
import { BLANK_TASK, TaskType, is_new_task } from '@/src/types/Task';
import { Button, Checkbox, Drawer, Link, TextField, debounce } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import EditTaskForm from '../../../task/EditTaskForm'
import AutoTaskCreator from '@/src/components/Llm/AutoTaskCreator';
import useTimeConverter from '@/src/hooks/useTimeConverter'
import { TaskId } from '@/src/types/Section';
import { useRouter } from 'next/router';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: UniqueIdentifier;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props['transform'];
    transition: Props['transition'];
    value: Props['value'];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {
      const { sections, getTask, updateTask } = useSections();
      const [convert] = useTimeConverter();
      const [task, setTask] = useState<TaskType>(BLANK_TASK);
      const [isEditing, setIsEditing] = useState(false);
      const router = useRouter();
      const projectId: number = parseInt(router.query.projectId as string)
      const convertedTime = useMemo(() => convert(task.estimated_time), [task.estimated_time])

      useEffect(() => {
        setTask(getTask(value) || BLANK_TASK);
      }, [value, sections])

      useEffect(() => {
        if (!dragOverlay && !dragging) {
          onTaskChange(task);
        }
      }, [task]);

      const onTaskChange = useCallback(
        debounce(
          (
            _task: TaskType
          ) => {
            updateTask(_task)
          },
          1000
        ),
        []
      );
      const handleTitleClick = () => {
        setIsEditing(true);
      };

      function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
      }

      const handleFocus = (e: React.FocusEvent<HTMLInputElement| HTMLTextAreaElement>) => {
        e.target.select();
      };

      const handleBlur = () => {
        setIsEditing(false);
      };

      const navigateTask = (taskId: TaskId) => {
        router.push({
          query: {
            projectId: projectId,
            taskId: taskId
          }
        },
          undefined,
          { shallow: true }
        )
      }
      
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);

      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <li
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay
          )}
          style={
            {
              ...wrapperStyle,
              transition: [transition, wrapperStyle?.transition]
                .filter(Boolean)
                .join(', '),
              '--translate-x': transform
                ? `${Math.round(transform.x)}px`
                : undefined,
              '--translate-y': transform
                ? `${Math.round(transform.y)}px`
                : undefined,
              '--scale-x': transform?.scaleX
                ? `${transform.scaleX}`
                : undefined,
              '--scale-y': transform?.scaleY
                ? `${transform.scaleY}`
                : undefined,
              '--index': index,
              '--color': color,
            } as React.CSSProperties
          }
          ref={ref}
        >
          <div
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              color && styles.color
            )}
            style={style}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {/* {task ? task.title : ''} */}
            {handle ? <Handle {...handleProps} {...listeners} /> : null}
            {/* <Checkbox
              checked={task.status === 2}
              onChange={handleStatusChange}
              disabled={is_new_task(task)}
            /> */}
            {isEditing ? (
              <TextField
                name="title"
                value={task.title}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  onFocus: handleFocus,
                  className: "text-blue-500"
                }}
                autoFocus
                data-dndkit-disabled-dnd-flag="true"
                className="w-1/2"
                sx={{
                  width: 360,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: 'none'
                    },
                    "&:hover fieldset": {
                      border: '1px solid rgba(0, 0, 0, 0.23)'
                    },
                  }
                }}
              />
            ) : (
              <p 
              onClick={handleTitleClick}
              className="w-1/2 text-blue-500 truncate"
              >
                {task.title}
              </p>
            )}
            <h3>{convertedTime}</h3>
            <span className={styles.Actions}>
              {onRemove ? (
                <Remove className={styles.Remove} onClick={onRemove} />
              ) : null}
              <Action onClick={() => navigateTask(task.id)}>
                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
              </Action>
              <AutoTaskCreator task={task} sectionId={task.section_id} />
            </span>
          </div>
        </li>
      );
    }
  )
);
