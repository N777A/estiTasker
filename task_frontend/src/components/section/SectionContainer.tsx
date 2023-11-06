
import React, { useCallback, useEffect, useState } from 'react';
import { SectionType, is_section_empty } from '@/src/types/Section';
import { TextField } from '@mui/material';
import { debounce } from 'lodash';
import useSections from '@/src/hooks/useSections';

export type SectionContainerProps = {
  projectId: number,
  section: SectionType,
  children?: React.ReactNode,
}

const SectionContainer: React.FC<SectionContainerProps> = ({ projectId, section, children }) => {
  const [_section, setSection] = useState(section)
  const { updateSection, deleteSection } = useSections()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSection({ ..._section, [name]: value });
  }

  useEffect(() => {
    setSection(section);
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
  }

  return (
    <div className="p-2">
      <div className="p-2 border-b">
        <TextField name="title" value={_section.title} onChange={handleChange} onBlur={onBlur}></TextField>
      </div>
      {children}
    </div>
  );
}

export default SectionContainer;
