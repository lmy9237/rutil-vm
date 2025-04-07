import React, { Suspense, useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DeleteModal from "../../../utils/DeleteModal";
import { useAllUnregisteredVMsFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToMB } from '../../../util';
import DomainGetVmTemplateModal from '../../../components/modal/domain/DomainGetVmTemplateModal';
import ActionButton from '../../../components/button/ActionButton';
import Loading from '../../../components/common/Loading';
import Localization from '../../../utils/Localization';
import SelectedIdView from '../../../components/common/SelectedIdView';
import useSearch from '../../../components/button/useSearch';
import SearchBox from '../../../components/button/SearchBox';

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
  } = useAllUnregisteredVMsFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVms, setSelectedVms] = useState([]); // 다중 선택된 데이터센터

  const transformedData = (Array.isArray(vms) ? vms : []).map((vm) => ({
    ...vm,
    name: vm?.name,
    memory: checkZeroSizeToMB(vm?.memorySize),
    cpu: vm?.cpuTopologyCnt,
    cpuArc: vm?.cpuArc,
    stopTime: vm?.stopTime,
  }))
  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
    <div className="dupl-header-group f-start">
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="header-right-btns">
        <ActionButton label="가져오기"
          actionType="default"
          onClick={() => setActiveModal("get")}
        />
        <ActionButton label="삭제"
          actionType="default"
          onClick={() => setActiveModal("delete")}
        />
      </div>
    </div>
    
      <TablesOuter columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedVms(selectedRows)}
        multiSelect={true}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />

      <SelectedIdView items={selectedVms} />

      <Suspense fallback={<Loading />}>
        {/* 가상머신 가져오기 모달 */}
        {activeModal === "get" && (
          <DomainGetVmTemplateModal
            isOpen={true}
            data={selectedVms}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "delete" && (
          <DeleteModal type="Vm"
            isOpen={true}
            onRequestClose={() => setActiveModal(null)}
            contentLabel={Localization.kr.VM}
            data={selectedVms}
          />
        )}
      </Suspense>
    </>
  );
};

export default DomainImportVms;
