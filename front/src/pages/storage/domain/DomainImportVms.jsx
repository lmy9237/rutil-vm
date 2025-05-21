import React, { Suspense, useState } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import useSearch from "@/hooks/useSearch";
import SelectedIdView from '@/components/common/SelectedIdView';
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import Loading from '@/components/common/Loading';
import { ActionButton } from '@/components/button/ActionButtons';
import SearchBox from '@/components/button/SearchBox';
import TablesOuter from "@/components/table/TablesOuter";
import TableColumnsInfo from "@/components/table/TableColumnsInfo";
import DomainGetVmTemplateModal from '@/components/modal/domain/DomainGetVmTemplateModal';
import { useAllUnregisteredVMsFromDomain } from "@/api/RQHook";
import { checkZeroSizeToMB } from '@/util';
import DeleteModal from "@/utils/DeleteModal";
import Localization from '@/utils/Localization';

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
    isRefetching: isVmsRefetching,
  } = useAllUnregisteredVMsFromDomain(domainId, (e) => ({ ...e }));

  const { activeModal, setActiveModal, } = useUIState()
  const {
    vmsSelected, setVmsSelected,
    domainsSelected,
  } = useGlobal(); // 다중 선택된 데이터센터

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

  // TODO: ActionButtons 생성
  // TODO: domainvm 관련 모달 생성
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={refetchVms} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default"
            disabled={vmsSelected.length === 0} 
            onClick={() => setActiveModal("domainvm:importVm")}
          />
          <ActionButton label={Localization.kr.REMOVE}
            actionType="default"
            disabled={vmsSelected.length === 0} 
            onClick={() => setActiveModal("domainvm:remove")}
          />
        </div>
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_IMPORT_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        multiSelect={true}
        isLoading={isVmsLoading} isRefetching={isVmsRefetching} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-vm_register;name=${domainsSelected[0]?.name}`}
      />
      <Suspense fallback={<Loading />}>
        {/* 가상머신 가져오기 모달 -> DomainImporttemplates에서도 쓰고있어서 domainmodals에 어떻게 써야하나! */}
        {activeModal().includes("domainvm:importVm") && (
          <DomainGetVmTemplateModal
            isOpen={true}
            data={vmsSelected}
          />
        )}
        {activeModal().includes("domainvm:remove") && (
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
