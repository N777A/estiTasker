
import React, { useCallback, useEffect, useState } from 'react';
import { SectionType, is_section_empty } from '@/src/types/Section';
import { Button, MenuItem, TextField } from '@mui/material';
import { debounce, forOwn } from 'lodash';
import useSections from '@/src/hooks/useSections';
import { useDroppable } from '@dnd-kit/core';
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import IconMenu from "@/src/components/common/IconMenu";
import DeleteSectionButton from './DeleteSectionButton';

export type SectionContainerProps = {
  projectId: number,
  section: SectionType,
  children?: React.ReactNode,
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({...args, wasDragging: true});

const SectionContainer: React.FC<SectionContainerProps> = ({ projectId, section, children }) => {
  const [_section, setSection] = useState(section)
  const [focused, setFocused] = useState(false);
  const { updateSection, deleteSection } = useSections()

  // Sortable
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
    id: section.id,
    // data: {
    //   type: 'container',
    //   children: items,
    // },
    animateLayoutChanges,
  });
  // const isOverContainer = over
  //   ? (section.id === over.id && active?.data.current?.type !== 'container') ||
  //   items.includes(over.id)
  //   : false;
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    // opacity: isDragging ? 0.5 : undefined,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSection({ ..._section, [name]: value });
  }

  useEffect(() => {
    setSection(section);
    console.log(section)
  }, [section]);

  useEffect(() => {
    onSectionChange(_section);
  }, [_section]);

  const onSectionChange = useCallback(
    debounce(
      (
        _section: SectionType
      ) => {
        if (!is_section_empty(_section)) {
          updateSection(_section, projectId)
        }
      },
      1000
    ),
    []
  );

  const onBlur = () => {
    if (is_section_empty(_section)) {
      deleteSection(_section.id)
    }
    setFocused(false);
  }

  return (
    <div className="p-2 border bg-white" ref={setNodeRef} style={style}>
      <div className="p-2 border-b"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button {...listeners} {...attributes}
          size='small'
        >
          <DragIndicatorIcon fontSize='small' />
        </Button>
        <TextField
          name="title"
          value={_section.title}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={() => setFocused(true)}
          data-dndkit-disabled-dnd-flag="true"
          sx={{
            display: "flex",
            width: 360,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { 
                border: focused ? '1px solid #3f51b5' : 'none'
              }
            }
          }}
          inputProps={{
            style: {fontSize: 20, fontWeight: 'bold'} 
          }}          
        />
        <IconMenu>
          <MenuItem>
            <DeleteSectionButton sectionId={_section.id}/>
          </MenuItem>
        </IconMenu>
      </div>
      {children}
    </div>
  );
}

export default SectionContainer;
