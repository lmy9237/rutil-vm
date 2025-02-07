import { useAllVnicProfilesFromNetwork } from "../../api/RQHook";
import TableColumnsInfo from "../table/TableColumnsInfo";
import TableOuter from "../table/TableOuter";
import { useNavigate} from 'react-router-dom';
import { Suspense, useState,useEffect } from 'react'; 
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import VnicProfileModal from "../Modal/VnicProfileModal";
import DeleteModal from "../Modal/DeleteModal";

// 애플리케이션 섹션
const NetworkVnicprofile = ({network}) => {
  console.log('Network prop:', network);
    const navigate = useNavigate();
    // 모달 관련 상태 및 함수
  const [activePopup, setActivePopup] = useState(null);
    const openPopup = (popupType) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);

    const [modals, setModals] = useState({ create: false, edit: false, delete: false });
    const [selectedVnicProfiles, setSelectedVnicProfiles] = useState(null);
    const toggleModal = (type, isOpen) => {
      setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

    const { 
        data: vnicProfiles,
        status: vnicProfilesStatus,
        isRefetching: isvnicProfilesRefetching,
        refetch: vnicProfilesRefetch,
        isError, 
        error, 
        isLoading
      } = useAllVnicProfilesFromNetwork(network?.id, toTableItemPredicateVnicProfiles);
      function toTableItemPredicateVnicProfiles(vnicProfile) {
        console.log('vnicProfile data 확인!!!!:', vnicProfile);
        return {
          id: vnicProfile?.id ?? '없음',
          dataCenterId: vnicProfile?.dataCenterVo?.id ?? '', 
          name: vnicProfile?.name ?? '없음',
          networkId: vnicProfile?.networkVo?.id ?? '',  // 네트워크 이름
          networkName: vnicProfile?.networkVo?.name ?? '',  // 네트워크 이름
          dataCenterVo: vnicProfile?.dataCenterVo?.name ?? '',  // 데이터 센터
          compatVersion: vnicProfile?.compatVersion ?? '없음',  // 호환 버전
          qosName: vnicProfile?.qosName ?? '',  // QoS 이름
          networkFilterVo: vnicProfile?.networkFilterVo?.name ?? '없음',  // 네트워크 필터
          portMirroring: vnicProfile?.portMirroring ? '사용' : '사용 안함',  // 포트 미러링 여부
          passThrough: vnicProfile?.passThrough ? '통과' : '아니요',  // 통과 여부
          description: vnicProfile?.description ?? '없음',  // 설명
        };
      }
      
  useEffect(() => {
    console.log('Current network prop in NetworkVnicprofile:', network);
  }, [network]);
    return (
        <>
        <div className="header_right_btns">
            <button onClick={() => toggleModal('create', true)}>새로 만들기</button>
            <button 
                onClick={() => selectedVnicProfiles?.id && toggleModal('edit', true)} 
                disabled={!selectedVnicProfiles?.id}
            >
                편집
            </button>
            <button 
                onClick={() => selectedVnicProfiles?.id && toggleModal('delete', true)} 
                disabled={!selectedVnicProfiles?.id}
            >
                제거
            </button>
        </div>
        <span>id = {selectedVnicProfiles?.id || ''}</span>
        {/* vNIC 프로파일 */}
        <TableOuter
          columns={TableColumnsInfo.VNIC_PROFILES} 
          data={vnicProfiles}
          onRowClick={(row, column, colIndex) => {
            console.log('선택한 vNIC Profile 행 데이터:', row);
  
            setSelectedVnicProfiles(row);
            if (colIndex === 2) {
              navigate(`/computing/datacenters/${row.dataCenterId}`);
            } 
          }}
          clickableColumnIndex={[2]} 
          onContextMenuItems={() => [
            <div key="새로 만들기"  onClick={() => console.log()}>새로 만들기</div>,
            <div key="편집" onClick={() => console.log()}>편집</div>,
            <div key="제거" onClick={() => console.log()}>제거</div>,
          ]}
        />
      {/*vNIC 프로파일(새로만들기)팝업 */}
      <Suspense>
          {(modals.create || (modals.edit && selectedVnicProfiles)) && (
              <VnicProfileModal
                  isOpen={modals.create || modals.edit}
                  onRequestClose={() => toggleModal(modals.create ? 'create' : 'edit', false)}
                  editMode={modals.edit}
                  vnicProfile={selectedVnicProfiles}
                  networkId={network?.id} // 네트워크 이름 전달
           
              />
          )}
          {modals.delete && selectedVnicProfiles && (
                <DeleteModal
                    isOpen={modals.delete}
                    type='vnic'
                    onRequestClose={() => toggleModal('delete', false)}
                    contentLabel={'vnic'}
                    data={ selectedVnicProfiles}
                    networkId={network?.id}
                />
                )}
        </Suspense>


      {/* <Modal
        isOpen={activePopup === 'vnic_new_popup'}
        onRequestClose={closePopup}
        contentLabel="새로만들기"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vnic_new_content_popup">
          <div className="popup_header">
            <h1>가상 머신 인터페이스 프로파일</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
          
          <div className="vnic_new_content">
            
            <div className="vnic_new_contents" style={{ paddingTop: '0.4rem' }}>
              
              
              <div className="vnic_new_box">
                <label htmlFor="data_center">데이터 센터</label>
                <select id="data_center" disabled>
                  <option value="none">Default</option>
                </select>
              </div>
              <div className="vnic_new_box">
                <label htmlFor="network">네트워크</label>
                <select id="network" disabled>
                  <option value="none">ovirtmgmt</option>
                </select>
              </div>
              <div className="vnic_new_box">
                <span>이름</span>
                <input type="text" id="name"/>
              </div>
              <div className="vnic_new_box">
                <span>설명</span>
                <input type="text" id="description" />
              </div>
              <div className="vnic_new_box">
                <label htmlFor="network_filter">네트워크 필터</label>
                <select id="network_filter">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="passthrough" />
                <label htmlFor="passthrough">통과</label>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="migratable" disabled checked />
                <label htmlFor="migratable">마이그레이션 가능</label>
              </div>
              <div className="vnic_new_box">
                <label htmlFor="failover_vnic_profile">페일오버 vNIC 프로파일</label>
                <select id="failover_vnic_profile" disabled>
                  <option value="none">없음</option>
                </select>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="port_mirroring" />
                <label htmlFor="port_mirroring">포트 미러링</label>
              </div>
  
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="allow_all_users" checked />
                <label htmlFor="allow_all_users">모든 사용자가 이 프로파일을 사용하도록 허용</label>
              </div>

            </div>
              
            
              
            
          </div>


          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal> */}
      {/*vNIC 프로파일(편집)팝업 */}
      {/* <Modal
        isOpen={activePopup === 'vnic_eidt_popup'}
        onRequestClose={closePopup}
        contentLabel="편집"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vnic_new_content_popup">
          <div className="popup_header">
            <h1>가상 머신 인터페이스 프로파일</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
          
          <div className="vnic_new_content">
            
            <div className="vnic_new_contents" style={{ paddingTop: '0.4rem' }}>
              
              
              <div className="vnic_new_box">
                <label htmlFor="data_center">데이터 센터</label>
                <select id="data_center" disabled>
                  <option value="none">Default</option>
                </select>
              </div>
              <div className="vnic_new_box">
                <label htmlFor="network">네트워크</label>
                <select id="network" disabled>
                  <option value="none">ovirtmgmt</option>
                </select>
              </div>
              <div className="vnic_new_box">
                <span>이름</span>
                <input type="text" id="name"value={'#'}/>
              </div>
              <div className="vnic_new_box">
                <span>설명</span>
                <input type="text" id="description"  />
              </div>
              <div className="vnic_new_box">
                <label htmlFor="network_filter">네트워크 필터</label>
                <select id="network_filter">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="passthrough" />
                <label htmlFor="passthrough">통과</label>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="migratable" disabled checked />
                <label htmlFor="migratable">마이그레이션 가능</label>
              </div>
              <div className="vnic_new_box">
                <label htmlFor="failover_vnic_profile">페일오버 vNIC 프로파일</label>
                <select id="failover_vnic_profile" disabled>
                  <option value="none">없음</option>
                </select>
              </div>
              <div className="vnic_new_checkbox">
                <input type="checkbox" id="port_mirroring" />
                <label htmlFor="port_mirroring">포트 미러링</label>
              </div>
 
            </div>
              
            
              
            
          </div>


          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal> */}
     </>
    );
  };
  
  export default NetworkVnicprofile;