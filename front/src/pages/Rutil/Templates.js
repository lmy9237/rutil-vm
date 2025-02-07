import React from 'react';
import {faDesktop } from '@fortawesome/free-solid-svg-icons';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllTemplates } from '../../api/RQHook';
import TemplateDupl from '../../pages/computing/template/TemplateDupl';

const Templates = () => {
  const { 
    data: templates = []
  } = useAllTemplates((e) => ({...e,}));

  return (
    <>
      <TemplateDupl
        columns={TableColumnsInfo.TEMPLATES}
        templates={templates}
      />      
    </>
  );
};

export default Templates;