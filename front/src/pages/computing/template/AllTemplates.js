import React from 'react';
import {faDesktop } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../components/footer/Footer';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useAllTemplates } from '../../../api/RQHook';
import TemplateDupl from '../../computing/template/TemplateDupl';
import HeaderButton from '../../../components/button/HeaderButton';

const AllTemplates = () => {
  const { 
    data: templates = [], isLoading: isTemplatesLoading,
  } = useAllTemplates((e) => ({...e,}));

  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faDesktop}
          title={'템플릿'}
        />
      </div>
      <div className="host-btn-outer">
        <TemplateDupl
          columns={TableColumnsInfo.TEMPLATES}
          templates={templates || []}
        />
      </div>
      <Footer/>
    </div>    
  );
};

export default AllTemplates;