import React, { useState } from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DeleteModal from '../../../utils/DeleteModal';
import { useAllUnregisteredVMFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToMB } from '../../../util';
import DomainGetVmTemplateModal from '../../../components/modal/domain/DomainGetVmTemplateModal';

/**
 * @name DomainGetVms
 * @description 도메인으로 가상머신 가져오기
 * 
 * @param {string} domainId 도메인ID
 * @returns 
 */
const DomainGetVms = ({ domainId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllUnregisteredVMFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVms, setSelectedVms] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedVms) ? selectedVms : []).map((vm) => vm.id).join(", ");

  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('get')}>가져오기</button>
        <button onClick={() => setActiveModal('delete')}>삭제</button>
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={vms.map((vm) => ({
          ...vm,
          name: vm?.name,
          memory: checkZeroSizeToMB(vm?.memorySize),
          cpu: vm?.cpuTopologyCnt,
          cpuArc: vm?.cpuArc,
          stopTime: vm?.stopTime,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedVms(selectedRows)}
        multiSelect={true}
      />

      {/* 가상머신 가져오기 모달 */}
      {activeModal === 'get' && (
        <DomainGetVmTemplateModal
          isOpen={true}
          data={selectedVms}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'delete' && (
        <DeleteModal
          isOpen={true}
          type="Vm"
          onRequestClose={() => setActiveModal(null)}
          contentLabel={'가상머신'}
          data={selectedVms}
        />
      )}
    </>
  );
};

export default DomainGetVms;
