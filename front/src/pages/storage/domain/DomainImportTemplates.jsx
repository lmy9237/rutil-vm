import React, { useCallback } from "react";
import toast from "react-hot-toast";
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
import Logger from "../../../utils/Logger";

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
    refetch: templateRefetch,
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates
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
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`EventDupl > handleRefresh ... `)
    if (!refetchTemplates) return;
    refetchTemplates()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  // TODO: ActionButtons 생성
  // TODO: TemplateModals 생성
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            disabled={templatesSelected.length === 0} 
            onClick={() => setActiveModal('domaintemplate:importVm')}
          />
          <ActionButton label={Localization.kr.REMOVE}
            actionType="default" 
            disabled={templatesSelected.length === 0} 
            onClick={() => setActiveModal("domaintemplate:remove")}
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
        refetch={refetchTemplates}
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />

      <SelectedIdView items={templatesSelected} />

      {/* 가져오기 모달 -> DomainImportVms에서도 쓰고있어서 domainmodals에 어떻게 써야하나! */}
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
