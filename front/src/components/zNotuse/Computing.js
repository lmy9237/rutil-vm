import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import HeaderButton from '../button/HeaderButton';
import Table from '../table/Table';
import TableColumnsInfo from '../table/TableColumnsInfo';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAllDataCenters } from '../../api/RQHook';
import { useDataCenter } from '../../api/RQHook';
import { faPencil, faArrowUp, faRefresh, faTimes } from '@fortawesome/free-solid-svg-icons'
import './css/Computing.css';
import TableOuter from '../table/TableOuter';

// React Modal 설정
Modal.setAppElement('#root');

const Computing = () => {
    const navigate = useNavigate();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    // const handleNameClick = (name) => {
    //     navigate(`/computing/datacenters/${name}`);
    // };

    const sectionHeaderButtons = [
        { id: 'new_btn', label: '새로 만들기', onClick: openCreateModal },
        { id: 'edit_btn', label: '편집', icon: faPencil, onClick: openEditModal },
      { id: 'delete_btn', label: '삭제', icon: faArrowUp, onClick: () => {} },
    ];
    /*
    const [datacenters, setDatacenters] = useState([]);
    useEffect(() => {
        async function fetchData() {
            console.log('fetching!!!')
            const res = await ApiManager.findAllDataCenters();
            setDatacenters(res);
        }
        fetchData()
    }, [])
    */
    const {
      data: datacenters,
      status: datacentersStatus,
      isRefetching: isDatacentersRefetching,
      refetch: refetchDatacenters,
      isError: isDatacentersError,
      error: datacentersError,
      isLoading: isDatacentersLoading
    } = useAllDataCenters((e) => {
        //DATACENTERS
        return {
          name: e?.name ?? '',
          comment: e?.comment ?? '',
          storageType: e?.storageType ? '로컬' : '공유됨',
          status: e?.status ?? '정보 없음',
          hostCnt :e?.hostCnt ?? '',
          clusterCnt :e?.clusterCnt ?? '',
          compatVersion: e?.version ?? '4.7',
          description: e?.description ?? '설명없음',
        }
    });

    const {
        data: datacenter,
        status: datacenterStatus,
        isRefetching: isDatacenterRefetching,
        refetch: refetchDatacenter,
        isError: isDatacenterError,
        error: datacenterError,
        isLoading: isDatacenterLoading
      } = useDataCenter((e) => {
          //DATACENTER
          return {
            id: '40dc4bc6-9016-4a90-ae86-f3d36095a29f',
            name: e?.name ?? '',
            description: e?.description ?? '', 
            storageType: e?.storageType ? '로컬' : '공유됨',
            compatVersion: e?.version ?? '4.7',            
            quotaMode: e?.quotaMode ?? 'Disabled',
            comment: e?.comment ?? '',
          }
      });

    // const handleRowClick = (row, column) => {
    //     console.log(`handleRowClick ... id: ${row.id}`)
    //     if (column.accessor === 'name') {
    //       navigate(
    //         `/computing/datacenters/${row.id}`,
    //         { state: { name: row.name } }
    //       );
    //     }
    // };

    return (
        <div id="section">
            <HeaderButton
                title="데이터 센터"
                subtitle=""
                buttons={sectionHeaderButtons}
                popupItems={[]}
                openModal={[]}
                togglePopup={() => {}}
            />
            <div className="content_outer">
                <div className="empty_nav_outer">
                    <TableOuter
                      columns={TableColumnsInfo.DATACENTERS}
                      data={datacenters}
                   
                      shouldHighlight1stCol={true}
                    />
                </div>
            </div>

           <Footer/>

            {/*새로 만들기 */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                contentLabel="새로 만들기"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="datacenter_new_popup">
                    <div className="popup_header">
                        <h1>새로운 데이터 센터</h1>
                        <button onClick={closeCreateModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                    </div>

                    <div className="datacenter_new_content">
                        <div>
                            <label htmlFor="name1">이름</label>
                            <input type="text" id="name1" />
                        </div>
                        <div className="network_form_group">
                            <label htmlFor="comment">설명</label>
                            <input type="text" id="comment" />
                        </div>
                  
                        <div>
                            <label htmlFor="cluster">클러스터</label>
                            <select id="cluster">
                                <option value="공유됨">공유됨</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="compatibility">호환버전</label>
                            <select id="compatibility">
                                <option value="4.7">4.7</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quota_mode">쿼터 모드</label>
                            <select id="quota_mode">
                                <option value="비활성화됨">비활성화됨</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="comment">코멘트</label>
                            <input type="text" id="comment" />
                        </div>
                       
                    </div>

                    <div className="edit_footer">
                        <button style={{ display: 'none' }}></button>
                        <button>OK</button>
                        <button onClick={closeCreateModal}>취소</button>
                    </div>
                </div>
            </Modal>

            {/*편집 */}
            <Modal
                 isOpen={isEditModalOpen}
                 onRequestClose={closeEditModal}
                contentLabel="새로 만들기"
                className="Modal"
                overlayClassName="Overlay"
                shouldCloseOnOverlayClick={false}
            >
                <div className="datacenter_new_popup">
                    <div className="popup_header">
                        <h1>데이터센터 편집</h1>
                        <button onClick={closeEditModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                    </div>

                    <div className="datacenter_new_content">
                        <div>
                            <label htmlFor="name1">이름</label>
                            <input type="text" id="name1" />
                        </div>
                        <div className="network_form_group">
                            <label htmlFor="comment">설명</label>
                            <input type="text" id="comment" />
                        </div>
                  
                        <div>
                            <label htmlFor="cluster">클러스터</label>
                            <select id="cluster">
                                <option value="공유됨">공유됨</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="compatibility">호환버전</label>
                            <select id="compatibility">
                                <option value="4.7">4.7</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quota_mode">쿼터 모드</label>
                            <select id="quota_mode">
                                <option value="비활성화됨">비활성화됨</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="comment">코멘트</label>
                            <input type="text" id="comment" />
                        </div>
                       
                    </div>

                    <div className="edit_footer">
                        <button style={{ display: 'none' }}></button>
                        <button>OK</button>
                        <button onClick={closeEditModal}>취소</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Computing;
