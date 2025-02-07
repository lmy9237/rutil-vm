import React, { useState } from 'react';
import TemplateActionButtons from './button/TemplateActionButtons';
import TemplateModals from './modal/TemplateModals';
import { useNavigate } from 'react-router-dom';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';

const TemplateDupl = ({ templates = [], columns = [], type }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const selectedIds = (Array.isArray(selectedTemplates) ? selectedTemplates : []).map((template) => template.id).join(', ');

  const handleNameClick = (id) => navigate(`/computing/templates/${id}`);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  
  return (
    <>
      <TemplateActionButtons
        openModal={openModal}
        isEditDisabled={selectedTemplates.length !== 1} 
        isDeleteDisabled={selectedTemplates.length === 0}
        // status={selectedTemplates[0]?.status}
      />
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter
        columns={columns}
        data={templates.map((temp) => ({
          ...temp,
          cluster:<TableRowClick type="cluster" id={temp?.clusterVo?.id}>{temp?.clusterVo?.name}</TableRowClick>,
          dataCenter: <TableRowClick type="datacenter" id={temp?.dataCenterVo?.id}>{temp?.dataCenterVo?.name}</TableRowClick>,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedTemplates(selectedRows)} 
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        onContextMenuItems={(row) => [
          <TemplateActionButtons
            openModal={openModal}
            isEditDisabled={!row} 
            type='context'
          />
        ]}
        />

        <TemplateModals
          activeModal={activeModal}
          template={selectedTemplates[0]}
          selectedTemplates={selectedTemplates}
          onClose={closeModal}
        />
    </>
  );
};

export default TemplateDupl;
