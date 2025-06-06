import React, { Suspense, useState } from "react";
import useUIState                from "@/hooks/useUIState";
import useGlobal                 from "@/hooks/useGlobal";
import useSearch                 from "@/hooks/useSearch";
import SelectedIdView            from '@/components/common/SelectedIdView';
import OVirtWebAdminHyperlink    from "@/components/common/OVirtWebAdminHyperlink";
import Loading                   from '@/components/common/Loading';
import { ActionButton }          from '@/components/button/ActionButtons';
import SearchBox                 from '@/components/button/SearchBox';
import TablesOuter               from "@/components/table/TablesOuter";
import TableColumnsInfo          from "@/components/table/TableColumnsInfo";
import DomainImportVmModal       from '@/components/modal/domain/DomainImportVmModal';
import { 
  useAllUnregisteredVMsFromDomain
} from "@/api/RQHook";
import { checkZeroSizeToMB } from '@/util';
import Localization              from '@/utils/Localization';

/**
 * @name DomainImportVms
 * @description 도메인으로 가상머신 가져오기 목록
 *
 * @param {string} domainId 도메인ID
 * @returns {JSX.Element} DomainImportVms
 */
const DomainImportVms = ({ 
  domainId
}) => {
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

  const [isImportPopup, setIsImportPopup] = useState(false); 

  const transformedData = [...vms].map((vm) => ({
    ...vm,
    name: vm?.name,
    memory: checkZeroSizeToMB(vm?.memorySize),
    cpuTopologyCnt: vm?.cpuTopologyCnt,
    cpuArc: vm?.cpuArc,
    creationTime: vm?.creationTime,
    diskCnt: [...vm?.diskAttachmentVos]?.length ?? 0,
    // stopTime: vm?.stopTime,
  }))
  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  // TODO: ActionButtons 생성
  
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchVms} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default"
            disabled={vmsSelected.length === 0}
            onClick={() => setIsImportPopup(true)}
          />
           <ActionButton label={Localization.kr.REMOVE}
            actionType="default"
            disabled={vmsSelected.length === 0}
            onClick={() => setActiveModal("vm:remove")}
          />
        </div>
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_IMPORT_FROM_STORAGE_DOMAIN}
        data={filteredData}
        shouldHighlight1stCol={true}
        searchQuery={searchQuery}  setSearchQuery={setSearchQuery}
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
        <DomainImportVmModal
          isOpen={isImportPopup}
          onClose={() => setIsImportPopup(false)}
        />
      </Suspense>
    </>
  );
};

export default DomainImportVms;
