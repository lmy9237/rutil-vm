import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../../hooks/useGlobal";
import useUIState from "../../../hooks/useUIState";
import Loading from "../../../components/common/Loading";
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TemplateNicDeleteModal from "../../../components/modal/template/TemplateNicDeleteModal";
import { useAllTemplatesFromNetwork } from "../../../api/RQHook";
import ActionButton from "../../../components/button/ActionButton";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";

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
  const { nicsSelected, setNicsSelected } = useGlobal()
  const { 
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplatesFromNetwork(networkId, (e) => ({ ...e }));

  const [modalData, setModalData] = useState(null); // 모달에 전달할 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 초기값 false

  // 선택된 Template ID와 NIC ID 추출
  const selectedTemplateIds = [...nicsSelected].map(t => t.id).join(', ');
  const selectedNicIds = [...nicsSelected].map(t => t.nicId).join(', ');

  const openDeleteModal = () => {
    // 제거 버튼 클릭 시 모달 열기
    Logger.debug("NetworkTemplates > openDeleteModal ... nicsSelected: ", nicsSelected)
    if (nicsSelected.length > 0) { // 선택된 항목이 있을 때만 동작
      setModalData(nicsSelected); // 선택된 항목을 모달에 전달
      setIsModalOpen(true); // 모달 열기
    }
  };

  Logger.debug("NetworkTemplates ...")
  return (
    <>
      <div className="header-right-btns no-search-box">
        {/* 제거 버튼에 openDeleteModal 핸들러 연결 */}
          <ActionButton
            label="제거"
            actionType="default"
            onClick={openDeleteModal}
            disabled={!selectedNicIds}  // selectedNicIds가 없으면 비활성화
          />
      </div>      

      <TablesOuter 
        columns={TableColumnsInfo.TEMPLATES_FROM_NETWORK}
        data={templates} 
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => nicsSelected(selectedRows)} // 선택된 항목 업데이트
        multiSelect={true}
        onContextMenuItems={(row) => [
          <div className='right-click-menu-box'>
            <button className='right-click-menu-btn' onClick={openDeleteModal}>제거</button>
          </div>
        ]}
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />

      <SelectedIdView items={nicsSelected}/>

      {/* 모달 렌더링 */}
      <Suspense fallback={<Loading/>}>
        {activeModal() === "nic:remove" && (
          <TemplateNicDeleteModal isOpen={activeModal() === "nic:remove"}
            onClose={() => setActiveModal(null)}
            data={modalData} // 선택된 NIC 데이터 전달
            templateId={selectedTemplateIds}
          />
        )}
      </Suspense>
    </>
  );
};

export default NetworkTemplates;

