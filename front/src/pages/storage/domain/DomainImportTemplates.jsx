import React, { Suspense, useState } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { Loading, LoadingFetch }        from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import { ActionButton }                 from "@/components/button/ActionButtons";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import DomainImportTemplateModal        from "@/components/modal/domain/DomainImportTemplateModal";
import {
  useAllUnregisteredTemplatesFromDomain
} from "@/api/RQHook";
import {
  checkZeroSizeToMB
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name DomainImportTemplates
 * @description 도메인으로 탬플릿 가져오기
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetTemplates
 * 
 * @see DomainTemplates
 */
const DomainImportTemplates = ({ 
  domainId
}) => {
  const { activeModal, setActiveModal, } = useUIState();
  const {
    domainsSelected,
    templatesSelected, setTemplatesSelected
  } = useGlobal(); // 다중 선택된 데이터센터
  
  const [isImportPopup, setIsImportPopup] = useState(false);   

  const {
    data: templates = [],
    refetch: templateRefetch,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
    isRefetching: isTemplatesRefetching,
  } = useAllUnregisteredTemplatesFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = [...templates].map((t) => ({
    ...t,
    name: t.name,
    memory: checkZeroSizeToMB(t.memorySize),
    cpu: t.cpuTopologyCnt,
    cpuArc: t.cpuArc,
    disk: t.disk,
    createdAt: t.creationTime,
    // osSystem: t.osSystem,
    exportedAt: t.exportedAt,
    // ✅ 검색 필드 추가
    searchText: `${t.name} ${checkZeroSizeToMB(t.memorySize)} ${t.cpuTopologyCnt} ${t.cpuArc} ${t.disk} ${t.creationTime} ${t.exportedAt}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} refetch={refetchTemplates} 
        />
        <LoadingFetch isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            disabled={templatesSelected.length === 0} 
            onClick={() => setIsImportPopup(true)} 
          />
         <ActionButton
            label={Localization.kr.REMOVE}
            actionType="default"
            disabled={templatesSelected.length === 0}
            onClick={() => setActiveModal("template:remove")}
          />
        </div>
      </div>

      <TablesOuter target={"template"}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />

      <SelectedIdView items={templatesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-template_register;name=${domainsSelected[0]?.name}`}
      />

      <Suspense fallback={<Loading />}>
        <DomainImportTemplateModal
          isOpen={isImportPopup}
          onClose={() => setIsImportPopup(false)}
        />
      </Suspense>

      {/* {activeModal().includes("domaintemplate:remove")  && (
        <DeleteModal contentLabel={Localization.kr.TEMPLATE}
          isOpen={true}
          type="DataCenter"
          data={templatesSelected}
          onRequestClose={() => setActiveModal(null)}
        />
      )} */}
    </>
  );
};

export default DomainImportTemplates;
