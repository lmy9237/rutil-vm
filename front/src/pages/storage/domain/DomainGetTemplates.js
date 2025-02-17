import React, { useState } from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainGetVmTemplateModal from '../../../components/modal/domain/DomainGetVmTemplateModal';
import DeleteModal from '../../../utils/DeleteModal';
import { useAllUnregisteredTemplateFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToMB } from '../../../util';

/**
 * @name DomainGetTemplates
 * @description 도메인으로 탬플릿 가져오기
 * 
 * @param {string} domainId 도메인ID
 * @returns 
 */
const DomainGetTemplates = ({ domainId }) => {
  const { 
    data: templates = [], 
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllUnregisteredTemplateFromDomain(domainId, (e) => ({ 
    ...e 
  }));

  const [activeModal, setActiveModal] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedTemplates) ? selectedTemplates : []).map((t) => t.id).join(', ');

  console.log("...")
  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('get')}>가져오기</button>
        <button onClick={() => setActiveModal('delete')}>삭제</button>
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={templates.map((t) => ({
          ...t,
          name: t.name,
          memory: checkZeroSizeToMB(t.memorySize),
          cpu: t.cpuTopologyCnt,
          cpuArc: t.cpuArc,
          disk: t.disk,
          createdAt: t.creationTime,
          exportedAt: t.exportedAt,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedTemplates(selectedRows)}
        multiSelect={true}
      />

      {/* 가상머신 가져오기 모달 */}
      {activeModal === 'get' && (
        <DomainGetVmTemplateModal
          isOpen={true}
          data={selectedTemplates}
          type="template"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'delete' && (
        <DeleteModal
          isOpen={true}
          type="DataCenter"
          onRequestClose={() => setActiveModal(null)}
          contentLabel={'템플릿'}
          data={selectedTemplates}
        />
      )}
    </>
  );
};

export default DomainGetTemplates;
