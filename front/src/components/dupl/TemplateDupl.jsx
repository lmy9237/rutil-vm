import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateActionButtons from "./TemplateActionButtons";
import TemplateModals from "../modal/template/TemplateModals";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";

const TemplateDupl = ({
  isLoading, isError, isSuccess,
  templates = [], columns = [], type 
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const selectedIds = (Array.isArray(selectedTemplates) ? selectedTemplates : [])
    .map((template) => template.id)
    .join(", ");

  const handleNameClick = (id) => navigate(`/computing/templates/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  console.log("...")
  return (
    <>
      <TemplateActionButtons
        openModal={openModal}
        isEditDisabled={selectedTemplates.length !== 1}
        isDeleteDisabled={selectedTemplates.length === 0}
        // status={selectedTemplates[0]?.status}
      />
      <span>ID: {selectedIds || ""}</span>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={templates.map((temp) => ({
          ...temp,
          cluster: (
            <TableRowClick type="cluster" id={temp?.clusterVo?.id}>
              {temp?.clusterVo?.name}
            </TableRowClick>
          ),
          dataCenter: (
            <TableRowClick type="datacenter" id={temp?.dataCenterVo?.id}>
              {temp?.dataCenterVo?.name}
            </TableRowClick>
          ),
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedTemplates(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        onContextMenuItems={(row) => [
          <TemplateActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
          />,
        ]}
      />
      {/* 탬플릿 모달창 */}
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
