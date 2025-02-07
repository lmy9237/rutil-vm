import {useClustersFromDataCenter} from "../../../api/RQHook";
import HostDu from "../../duplication/HostDu";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableOuter from "../../table/TableOuter";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";


const DatacenterCluster = ({ dataCenter }) => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState({
        edit: false,
        permission: false,
      });
      const handleOpenModal = (type) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: true }));
      };
      const handleCloseModal = (type) => {
        setIsModalOpen((prev) => ({ ...prev, [type]: false }));
      };

      const { 
        data: clusters, 
        status: clustersStatus, 
        isLoading: isClustersLoading, 
        isError: isClustersError 
      } = useClustersFromDataCenter(dataCenter?.id, toTableItemPredicateClusters);
      function toTableItemPredicateClusters(cluster) {
        return {
          id: cluster?.id ?? '', 
          name: cluster?.name ?? '없음',
          description: cluster?.description ?? '없음',
          version: cluster?.version ?? '없음',
        };
      }

    return (
        <>
        <div className="header_right_btns">
          <button onClick={() => handleOpenModal('cluster_new')}>새로 만들기</button>
          <button onClick={() => handleOpenModal('cluster_new')}>편집</button>
          <button onClick={() => handleOpenModal('delete')}>삭제</button>
        </div>
        <TableOuter
          columns={TableColumnsInfo.CLUSTERS_FROM_DATACENTER}
          data={clusters}
          onRowClick={(row, column, colIndex) => {
            if (colIndex === 0) {
              navigate(`/computing/clusters/${row.id}`); 
            }
          }}
          clickableColumnIndex={[0]} 
          onContextMenuItems={() => [
            <div key="새로 만들기" onClick={() => console.log()}>새로 만들기</div>,
            <div key="편집" onClick={() => console.log()}>편집</div>,
            <div key="삭제" onClick={() => console.log()}>삭제</div>,
          ]}
        />
        
          {/* 클러스터 새로 만들기 팝업After */}
          <Modal
            isOpen={isModalOpen.cluster_new}
            onRequestClose={handleCloseModal}
            contentLabel="새로 만들기"
            className="Modal"
            overlayClassName="Overlay"
            shouldCloseOnOverlayClick={false}
        >
            <div className="cluster_new_popup">
                <div className="popup_header">
                    <h1>새 클러스터</h1>
                    <button onClick={() =>handleCloseModal('cluster_new')}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                </div>

               
                

                {/* 일반 */}
              
                    <form className="cluster_common_form py-0.5">
                        <div className="network_form_group">
                        <label htmlFor="data_center">데이터 센터</label>
                        <select id="data_center">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <div>
                            <label htmlFor="name">이름</label>
                        </div>
                        <input type="text" id="name" />
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="description">설명</label>
                        <input type="text" id="description" />
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="comment">코멘트</label>
                        <input type="text" id="comment" />
                        </div>
                  
                        <div className="network_form_group">
                        <label htmlFor="management_network">관리 네트워크</label>
                        <select id="management_network">
                            <option value="ovirtmgmt">ovirtmgmt</option>
                            <option value="ddd">ddd</option>
                            <option value="hosted_engine">hosted_engine</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="cpu_architecture">CPU 아키텍처</label>
                        <select id="cpu_architecture">
                            <option value="정의되지 않음">정의되지 않음</option>
                            <option value="x86_64">x86_64</option>
                            <option value="ppc64">ppc64</option>
                            <option value="s390x">s390x</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="cpu_type">CPU 유형</label>
                        <select id="cpu_type">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="chipset_firmware_type">침셋/펌웨어 유형<FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/></label>
                        <select id="chipset_firmware_type">
                            <option value="default">Default</option>
                        </select>
                        </div>
                    
                        <div className="network_checkbox_type2">
                        <input type="checkbox" id="bios_change" name="bios_change" />
                        <label htmlFor="bios_change">BIOS를 사용하여 기존 가상 머신/템플릿을 1440fx에서 Q35 칩셋으로 변경</label>
                        
                        </div>
                    
                        {/* <div className="network_form_group">
                        <label htmlFor="default_network_provider">기본 네트워크 공급자</label>
                        <select id="default_network_provider">
                            <option value="기본 공급자가 없습니다.">기본 공급자가 없습니다.</option>
                            <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
                        </select>
                        </div>
                    
                        <div className="network_form_group">
                        <label htmlFor="max_memory_limit">로그인 최대 메모리 한계</label>
                        <select id="max_memory_limit">
                            <option value="default">Default</option>
                        </select>
                        </div> */}

                        <div>
                          <div className='font-bold px-1.5 py-0.5'>복구 정책<FontAwesomeIcon icon={faInfoCircle} style={{ color: 'rgb(83, 163, 255)' }}fixedWidth/></div>
                          <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="migration_option" name="recovery_policy" checked/>
                            <label htmlFor="migration_option">가상 머신을 마이그레이션함</label>
                          </div>

                          <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="high_usage_migration_option" name="recovery_policy" />
                            <label htmlFor="high_usage_migration_option">고가용성 가상 머신만 마이그레이션</label>
                          </div>

                          <div className='host_text_radio_box px-1.5 py-0.5'>
                            <input type="radio" id="no_migration_option" name="recovery_policy" />
                            <label htmlFor="no_migration_option">가상 머신은 마이그레이션 하지 않음</label>
                          </div>
                        </div>
          
                    </form>
                  
                
              
            
                
                <div className="edit_footer">
                    <button style={{ display: 'none' }}></button>
                    <button>OK</button>
                    <button onClick={() =>handleCloseModal('cluster_new')}>취소</button>
                </div>
            </div>
        </Modal>
    </>
    );
  };
  
  export default DatacenterCluster;