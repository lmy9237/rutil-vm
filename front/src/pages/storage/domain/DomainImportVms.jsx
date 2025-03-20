import React, { Suspense, useState } from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DeleteModal from '../../../utils/DeleteModal';
import { useAllUnregisteredVMFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToMB } from '../../../util';
import DomainGetVmTemplateModal from '../../../components/modal/domain/DomainGetVmTemplateModal';
import ActionButton from '../../../components/button/ActionButton';
import Loading from '../../../components/common/Loading';

/**
 * @name DomainGetVms
 * @description 도메인으로 가상머신 가져오기 목록
 * 
 * @param {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetVms
 */
const DomainImportVms = ({ domainId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllUnregisteredVMFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = vms.map((vm) => ({
    ...vm,
    name: vm?.name,
    memory: checkZeroSizeToMB(vm?.memorySize),
    cpu: vm?.cpuTopologyCnt,
    cpuArc: vm?.cpuArc,
    stopTime: vm?.stopTime,
  }))

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVms, setSelectedVms] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedVms) ? selectedVms : []).map((vm) => vm.id).join(", ");

  return (
    <>
      <div className="header-right-btns">
        <ActionButton 
          label="가져오기" 
          actionType="default" 
          onClick={() => setActiveModal('get')}
        />
        <ActionButton 
          label="삭제" 
          actionType="default" 
          onClick={() => setActiveModal('delete')}
        />
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={transformedData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedVms(selectedRows)}
        multiSelect={true}
      />

      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
};

export default DomainImportVms;
