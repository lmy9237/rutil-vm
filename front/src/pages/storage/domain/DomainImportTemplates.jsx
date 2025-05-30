import React, { useCallback } from "react";
import useUIState                                from "@/hooks/useUIState";
import useGlobal                                 from "@/hooks/useGlobal";
import useSearch                                 from "@/hooks/useSearch";
import SelectedIdView                            from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink                    from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                                 from "@/components/button/SearchBox";
import { ActionButton }                          from "@/components/button/ActionButtons";
import TablesOuter                               from "@/components/table/TablesOuter";
import TableColumnsInfo                          from "@/components/table/TableColumnsInfo";
import DomainGetVmTemplateModal                  from "@/components/modal/domain/DomainImportVmTemplateModal";
import { useAllUnregisteredTemplatesFromDomain } from "@/api/RQHook";
import { checkZeroSizeToMB } from "@/util";
import DeleteModal from "@/utils/DeleteModal";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";

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
    exportedAt: t.exportedAt,
    // ✅ 검색 필드 추가
    searchText: `${t.name} ${checkZeroSizeToMB(t.memorySize)} ${t.cpuTopologyCnt} ${t.cpuArc} ${t.disk} ${t.creationTime} ${t.exportedAt}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchTemplates} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            disabled={templatesSelected.length === 0} 
            onClick={() => setActiveModal("template:import")} 
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
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
      <SelectedIdView items={templatesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-template_register;name=${domainsSelected[0]?.name}`}
      />

      {/* 가져오기 모달 -> DomainImportVms에서도 쓰고있어서 domainmodals에 어떻게 써야하나! */}
      {/* {activeModal().includes("domaintemplate:importVm")  && (
        <DomainGetVmTemplateModal
          isOpen={activeModal().includes("domaintemplate:importVm")}
          type="template"
          data={templatesSelected}
          onClose={() => setActiveModal(null)} 
        />
      )} */}

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
