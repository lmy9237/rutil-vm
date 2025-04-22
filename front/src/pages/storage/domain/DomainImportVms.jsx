import React, { Suspense, useState } from "react";
import useSearch from '../../../hooks/useSearch';
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
import SearchBox from '../../../components/button/SearchBox';
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";

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
    refetch: refetchVms,
  } = useAllUnregisteredVMsFromDomain(domainId, (e) => ({ ...e }));

  const { activeModal, setActiveModal, } = useUIState()
  const { vmsSelected, setVmsSelected } = useGlobal(); // 다중 선택된 데이터센터

  const transformedData = [...vms].map((vm) => ({
    ...vm,
    name: vm?.name,
    memory: checkZeroSizeToMB(vm?.memorySize),
    cpuTopologyCnt: vm?.cpuTopologyCnt,
    cpuArc: vm?.cpuArc,
    creationTime: vm?.creationTime,
    // stopTime: vm?.stopTime,
  }))
  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
    <div className="dupl-header-group f-start">
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={refetchVms} />
      <div className="header-right-btns">
        <ActionButton label={Localization.kr.IMPORT}
          actionType="default"
          onClick={() => setActiveModal("get")}
        />
        <ActionButton label={Localization.kr.REMOVE}
          actionType="default"
          onClick={() => setActiveModal("delete")}
        />
      </div>
    </div>
    
      <TablesOuter columns={TableColumnsInfo.VMS_IMPORT_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        multiSelect={true}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />

      <SelectedIdView items={vmsSelected} />

      <Suspense fallback={<Loading />}>
        {/* 가상머신 가져오기 모달 */}
        {activeModal() === "domaintemplate:importVm" && (
          <DomainGetVmTemplateModal
            isOpen={true}
            data={vmsSelected}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal() === "domaintemplate:remove" && (
          <DeleteModal type="Vm" isOpen={true}
            contentLabel={Localization.kr.VM}
            data={vmsSelected}
            onRequestClose={() => setActiveModal(null)}
          />
        )}
      </Suspense>
    </>
  );
};

export default DomainImportVms;
