import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DeleteModal from "../../../utils/DeleteModal";
import TemplateNicDeleteModal from "../../../components/modal/template/TemplateNicDeleteModal";
import { useAllTemplatesFromNetwork } from "../../../api/RQHook";

/**
 * @name NetworkTemplates
 * @description 네트워크에 종속 된 탬플릿 목록
 *
 * @param {string} networkId 네트워크 ID
 * @returns
 */
const NetworkTemplates = ({ networkId }) => {
  const navigate = useNavigate();
  const { 
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplatesFromNetwork(networkId, (e) => ({ 
    ...e
  }));

  const [selectedNics, setSelectedNics] = useState([]); // 선택된 항목
  const [modalData, setModalData] = useState(null); // 모달에 전달할 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 초기값 false

  // 선택된 Template ID와 NIC ID 추출
  const selectedTemplateIds = (Array.isArray(selectedNics) ? selectedNics : []).map(template => template.id).join(', ');
  const selectedNicIds = (Array.isArray(selectedNics) ? selectedNics : []).map(template => template.nicId).join(', ');

  // 이름 클릭 시 이동
  const handleNameClick = (id) => navigate(`/computing/templates/${id}`);

  const openDeleteModal = () => {
    // 제거 버튼 클릭 시 모달 열기
    console.log("NetworkTemplates > openDeleteModal ...")
    if (selectedNics.length > 0) { // 선택된 항목이 있을 때만 동작
      setModalData(selectedNics); // 선택된 항목을 모달에 전달
      setIsModalOpen(true); // 모달 열기
    }
  };

  const closeDeleteModal = () => {
    // 모달 닫기
    console.log("NetworkTemplates > closeDeleteModal ...")
    setIsModalOpen(false); // 모달 닫기
    setModalData(null); // 모달 데이터 초기화
  };

  // 모달 렌더링
  const renderModals = () => (
    <Suspense fallback={<Loading/>}>
      {isModalOpen && (
        <TemplateNicDeleteModal
          isOpen={isModalOpen}
          onClose={closeDeleteModal}
          data={modalData} // 선택된 NIC 데이터 전달
          templateId={selectedTemplateIds}
        />
      )}
    </Suspense>
  );
  

  console.log("...")
  return (
    <>
      <div className="header-right-btns">
        {/* 제거 버튼에 openDeleteModal 핸들러 연결 */}
        <button onClick={openDeleteModal} disabled={!selectedNicIds}>제거</button>
      </div>
      
      {/* 선택된 Template ID와 NIC ID 표시 */}
      <span>선택된 Template ID: {selectedTemplateIds || '없음'}</span>
      <br />
      <span>선택된 NIC ID: {selectedNicIds || '없음'}</span>

      <TablesOuter data={templates} columns={TableColumnsInfo.TEMPLATES_FROM_NETWORK}
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedNics(selectedRows)} // 선택된 항목 업데이트
        multiSelect={true}
        onContextMenuItems={(row) => [
          <div className='right-click-menu-box'>
            <button className='right-click-menu-btn' onClick={openDeleteModal}>제거</button>
          </div>
        ]}
      />

      {/* 모달 렌더링 */}
      {renderModals()}
    </>
  );
};

export default NetworkTemplates;

