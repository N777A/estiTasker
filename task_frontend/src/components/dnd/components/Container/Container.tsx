import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Handle, Remove } from '../Item';

import styles from './Container.module.css';
import { UniqueIdentifier } from '@dnd-kit/core';
import useSections from '@/src/hooks/useSections';
import { TextField, debounce } from '@mui/material';
import { BLANK_SECTION, SectionType } from '@/src/types/Section';
import { BLANK_TASK } from '@/src/types/Task';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  sectionId?: UniqueIdentifier;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      sectionId,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? 'button' : 'div';

    const { getSection, updateSection, addTask } = useSections();
    const [section, setSection] = useState<SectionType>(BLANK_SECTION);

    useEffect(() => {
      setSection(getSection(sectionId || "") || BLANK_SECTION)
    }, [sectionId])

    const debouncedUpdateSection = useCallback(
      debounce(
        async (newSection: SectionType) => {
          await updateSection(newSection);
        },
        1000
      ),
      [updateSection]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const newSection = { ...section, [name]: value };
      setSection(newSection);
      debouncedUpdateSection(newSection)
    }

    const addBlankTask = (sectionId: UniqueIdentifier = 0) => {
      console.log("add blank task")
      console.log(section)
      const tasks = Array.from(section.tasks.values()).sort((taskA, taskB) => taskA.position - taskB.position)
      const maxPosition = tasks[tasks.length - 1].position
      const _task = {
        ...JSON.parse(JSON.stringify(BLANK_TASK)),
        position: maxPosition + 1
      }
      addTask(sectionId, _task)
    }

    return (
      <Component
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {sectionId ? (
          <div className={styles.Header}>
            {/* {section.title} */}
            <TextField
              name="title"
              value={section.title}
              size="small"
              onChange={handleChange}
              data-dndkit-disabled-dnd-flag="true"
            />
            <div className={styles.Actions}>
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
        {sectionId ? (
          <button className="p-2 text-sm" onClick={() => addBlankTask(sectionId)} data-dndkit-disabled-dnd-flag="true">タスクを追加</button>
        ) : null}
      </Component>
    );
  }
);
