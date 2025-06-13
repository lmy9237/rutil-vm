import { Suspense, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import useSearch               from "@/hooks/useSearch";
import Loading                 from "@/components/common/Loading";
import SelectedIdView          from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink  from "@/components/common/OVirtWebAdminHyperlink";
import { ActionButton }        from "@/components/button/ActionButtons";
import SearchBox               from "@/components/button/SearchBox";
import TablesOuter             from '@/components/table/TablesOuter';
import TableColumnsInfo        from "@/components/table/TableColumnsInfo";
import TemplateNicDeleteModal  from "@/components/modal/template/TemplateNicDeleteModal";
import {
  useAllTemplatesFromNetwork 
} from "@/api/RQHook";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name NetworkTemplates
 * @description 네트워크에 종속 된 탬플릿 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkTemplates
 */
const NetworkTemplates = ({
  networkId
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const {
    datacentersSelected,
    networksSelected,
    nicsSelected, setNicsSelected
  } = useGlobal()
  const [modalData, setModalData] = useState(null); // 모달에 전달할 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 초기값 false
  
  const { 
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
    isRefetching: isTemplatesRefetching,
  } = useAllTemplatesFromNetwork(networkId, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...templates].map((e) => ({
    ...e
  })), [templates])

  // 선택된 Template ID와 NIC ID 추출
  const selectedTemplateIds = useMemo(() => 
    [...nicsSelected].map((t) => t.id)
      .join(', ')
    , [nicsSelected])

  const selectedNicIds = useMemo(() => 
    [...nicsSelected].map(t => t.nicId)
      .join(', ')
    , [nicsSelected])

  const openDeleteModal = useCallback(() => {
    // 제거 버튼 클릭 시 모달 열기
    Logger.debug("NetworkTemplates > openDeleteModal ... nicsSelected: ", nicsSelected)
    if (nicsSelected.length > 0) { // 선택된 항목이 있을 때만 동작
      setModalData(nicsSelected); // 선택된 항목을 모달에 전달
      setIsModalOpen(true); // 모달 열기
    }
  }, []);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchTemplates} />
        <div className="header-right-btns">
          {/* 제거 버튼에 openDeleteModal 핸들러 연결 */}
          <ActionButton actionType="default" label={Localization.kr.REMOVE}
            onClick={openDeleteModal}
            disabled={!selectedNicIds}  // selectedNicIds가 없으면 비활성화
          />
        </div>
      </div>
      <TablesOuter target={"template"}
        columns={TableColumnsInfo.TEMPLATES_FROM_NETWORK}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => nicsSelected(selectedRows)} // 선택된 항목 업데이트
        isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
      <SelectedIdView items={nicsSelected}/>
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
        path={`networks-templates;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
      />
      {/* 모달 렌더링 */}
      <Suspense fallback={<Loading/>}>
        {activeModal().includes("template:remove") && (
          <TemplateNicDeleteModal isOpen={activeModal().includes("template:remove")}
            data={modalData} // 선택된 NIC 데이터 전달
            templateId={selectedTemplateIds}
          />
        )}
      </Suspense>
    </>
  );
};

export default NetworkTemplates;

