import { useState, useEffect, Suspense } from 'react'; 
import { useNavigate } from 'react-router-dom';
import TableColumnsInfo from "../table/TableColumnsInfo";
import TableOuter from "../table/TableOuter";
import TableColumnsInfo from "../table/TableColumnsInfo";
import DeleteModal from "../Modal/DeleteModal";
import { useAllTemplatesFromNetwork } from "../../api/RQHook";

// 애플리케이션 섹션
const NetworkTemplate = ({ network }) => {

    const [activePopup, setActivePopup] = useState(null);
    const openPopup = (popupType) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);

    const [modals, setModals] = useState({ delete: false });
    const [selectedTemplates, setSelecTemplates] = useState(null);
    const toggleModal = (type, isOpen) => {
      setModals((prev) => ({ ...prev, [type]: isOpen }));
  };
    const { 
      data: templates = [], 
      status: templatesStatus, 
      isLoading: isTemplatesLoading, 
      isError: isTemplatesError 
    } = useAllTemplatesFromNetwork(network?.id, toTableItemPredicateTemplates);

    function toTableItemPredicateTemplates(template) {
      return {
        name: template?.name ?? '없음',  // 템플릿 이름
        nicId: template?.nicId ?? '없음',  // 템플릿 버전
        status: template?.status ?? '없음',  // 템플릿 상태
        clusterName: template?.clusterName ?? '없음',  // 클러스터 이름
        nicName: template?.nicName ?? '없음',  // vNIC 이름
      };
    }

    return (
      <>
        <div className="header_right_btns">
        <button onClick={() => selectedTemplates?.id && toggleModal('delete', true)} disabled={!selectedTemplates?.id}>제거</button>
        </div>

        <span>id = {selectedTemplates?.name || ''}</span>
        <TableOuter 
          columns={TableColumnsInfo.TEMPLATES_FROM_NETWORK}
          data={templates}
          onRowClick={(row, column, colIndex) => {
            console.log('선택한 vNIC Profile 행 데이터:', row);
            setSelecTemplates(row);
          }}
          onContextMenuItems={() => [
            <div key="네트워크 템플릿 제거" onClick={() => console.log()}>제거</div>
          ]}
        />
        <Suspense>
         {/*api없음 */}
          {modals.delete && selectedTemplates && (
            <DeleteModal
                isOpen={modals.delete}
                type='가상머신'
                onRequestClose={() => toggleModal('delete', false)}
                contentLabel={'가상머신'}
                data={ selectedTemplates}
                networkId={network?.id}
            />
            )}
        </Suspense>
      </>
    );
};

export default NetworkTemplate;
