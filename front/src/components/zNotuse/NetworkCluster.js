import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAllClustersFromNetwork} from "../../api/RQHook";
import TableColumnsInfo from "../table/TableColumnsInfo";
import TableOuter from "../table/TableOuter";
import { useNavigate} from 'react-router-dom';
import { useState } from 'react'; 
import Modal from 'react-modal';
import { faChevronLeft, faTimes } from "@fortawesome/free-solid-svg-icons";

// 애플리케이션 섹션
const NetworkCluster = ({ network }) => {
    const navigate = useNavigate();
    
    // 모달 관련 상태 및 함수
  const [activePopup, setActivePopup] = useState(null);
    const openPopup = (popupType) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);


    
  const { 
    data: clusters, 
    status: clustersStatus, 
    isLoading: isClustersLoading, 
    isError: isClustersError 
  } = useAllClustersFromNetwork(network?.id, toTableItemPredicateClusters);
  function toTableItemPredicateClusters(cluster) {
    return {
      id: cluster?.id ?? '없음',
      name: cluster?.name ?? '없음',
      description: cluster?.description ?? '없음',
      version: cluster?.version ?? '없음',
      connectedNetwork: cluster?.connected ? <input type="checkbox" checked disabled/> : <input type="checkbox" disabled/>,
      networkStatus: <FontAwesomeIcon icon={faChevronLeft} fixedWidth/>,
      requiredNetwork: cluster?.requiredNetwork ? <input type="checkbox" checked disabled/> : <input type="checkbox" disabled/>,
      networkRole: cluster?.networkRole ?? '',
    };
  }
  if (!network) {
    return <div>네트워크 데이터가 없습니다.</div>;
  }
  
  // 클러스터 팝업 임시데이터(보류)
  const clusterPopupData = [
    {
      name: 'Default',
      allAssigned: (
        <>
          <div className='flex'>
            <input type="checkbox" checked /> <label>할당</label>
          </div>
        </>
      ),
      allRequired: (
          <div className='flex'>
            <input type="checkbox" checked /> <label>필요</label>
          </div>
      ),
      vmNetMgmt: (
        <>
          <i class="fa-solid fa-star" style={{ color: 'green'}}fixedWidth/>
        </>
      ),
      networkOutput: <input type="checkbox" />,
      migrationNetwork: <input type="checkbox"/>,
      glusterNetwork: <input type="checkbox"/>,
      defaultRouting: <input type="checkbox"/>,
    },
  ];
  

    return (
      
        <>
        <div className="header_right_btns">
            <button onClick={() => openPopup('cluster_network_popup')}>네트워크 관리</button>
        </div>
      
        <TableOuter
          columns={TableColumnsInfo.CLUSTERS}
          data={clusters}
          onRowClick={(row, column, colIndex) => {
            if (!row || !row.id) {
              console.error('Row 데이터가 비어있거나 ID가 없습니다.');
              return;
            }
          
            const clickableCols = [0];
            if (clickableCols.includes(colIndex)) {
              if (colIndex === 0) {
                navigate(`/computing/clusters/${row.id}`);
              }
            } else {
              console.log('Selected Cluster ID:', row.id);
            }
          }}
          
          clickableColumnIndex={[0]}
          onContextMenuItems={() => [
            <div key="네트워크 관리" onClick={() => console.log()}>네트워크 관리</div>,
          ]}
        />
       {/*클러스터(네트워크 관리)팝업*/}
       <Modal
        isOpen={activePopup === 'cluster_network_popup'}
        onRequestClose={closePopup}
        contentLabel="네트워크 관리"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="manage_network_popup">
          <div className="popup_header">
            <h1>네트워크 관리</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
          
          <TableOuter 
            columns={TableColumnsInfo.CLUSTERS_POPUP} 
            data={clusterPopupData} 
            onRowClick={() => console.log('Row clicked')} 
          />
          
          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>

   </>
    );
  };
  
  export default NetworkCluster;