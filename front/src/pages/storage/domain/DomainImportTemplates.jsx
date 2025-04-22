import React, { useState } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainGetVmTemplateModal from "../../../components/modal/domain/DomainGetVmTemplateModal";
import DeleteModal from "../../../utils/DeleteModal";
import SearchBox from "../../../components/button/SearchBox";
import ActionButton from "../../../components/button/ActionButton";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { checkZeroSizeToMB } from "../../../util";
import { useAllUnregisteredTemplatesFromDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainImportTemplates
 * @description 도메인으로 탬플릿 가져오기
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetTemplates
 */
const DomainImportTemplates = ({ 
  domainId
}) => {
  const { activeModal, setActiveModal, } = useUIState();
  const { templatesSelected, setTemplatesSelected } = useGlobal(); // 다중 선택된 데이터센터

  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
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
    <>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            onClick={() => setActiveModal('domaintemplate:importVm')}
          />
          <ActionButton label={Localization.kr.REMOVE}
            actionType="default" 
            onClick={() => setActiveModal("domaintemplate:remove")}
          />
        </div>
      </div>

      <TablesOuter
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        multiSelect={true}
      />

      <SelectedIdView items={templatesSelected} />

      {/* 가상머신 가져오기 모달 */}
      {activeModal() === "domaintemplate:importVm" && (
        <DomainGetVmTemplateModal
          isOpen={true}
          type="template"
          data={templatesSelected}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal() === "domaintemplate:remove" && (
        <DeleteModal contentLabel={Localization.kr.TEMPLATE}
          isOpen={true}
          type="DataCenter"
          data={templatesSelected}
          onRequestClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};

export default DomainImportTemplates;
