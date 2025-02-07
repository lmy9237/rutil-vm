import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import HeaderButton from '../button/HeaderButton';
import Table from '../table/Table';
import TableColumnsInfo from '../table/TableColumnsInfo';
import Footer from '../footer/Footer';
import ApiManager from '../../api/ApiManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faDatabase, faExclamationTriangle, faTimes} from '@fortawesome/free-solid-svg-icons'
import TableOuter from '../table/TableOuter';
import './css/AllDisk.css';
import { useAllDisks } from '../../api/RQHook';
import Path from '../Header/Path';

Modal.setAppElement('#root');

const AllDisk = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activePopup, setActivePopup] = useState(null);
  const [activeTab, setActiveTab] = useState('img');
  const openPopup = (popupType) => {
    setActivePopup(popupType);
  };
  const closePopup = () => {
    setActivePopup(null);
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleContent = () => {
    setIsVisible(!isVisible);
  };

  const [activeDiskType, setActiveDiskType] = useState('all');
const handleDiskTypeClick = (type) => {
  setActiveDiskType(type);  // 여기서 type을 설정해야 함
};
const [activeContentType, setActiveContentType] = useState('all'); // 컨텐츠 유형 상태
  // 컨텐츠 유형 변경 핸들러
  const handleContentTypeChange = (event) => {
    setActiveContentType(event.target.value);
  };  
/*
  const [data, setData] = useState([
    {
      status: <FontAwesomeIcon icon={faCaretUp} style={{ color: '#1DED00' }}fixedWidth/>,
      icon: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
      domainName: 'ㅁㅎㅇㅁㄹㄹ', // 여기에 도메인 이름을 설정합니다.
      comment: '',
      domainType: '',
      storageType: '',
      format: '',
      dataCenterStatus: '',
      totalSpace: '',
      freeSpace: '',
      reservedSpace: '',
      description: '',
    },
  ])
  useEffect(() => {
    const fetchData = async () => {
        const res = await ApiManager.findAllStorageDomains() ?? []
        const items = res.map((e) => toTableItemPredicate(e))
        setData(items)
    }
    fetchData()
  }, [])
  */
  const sectionHeaderButtons = [

  ];
  
  const pathData = ['스토리지','디스크'];

  const { 
    data: allDisks,
    status: allDisksStatus,
    isRefetching: isAllDisksRefetching,
    refetch: allDisksRefetch, 
    isError: isAllDisksError, 
    error: allDisksError, 
    isLoading: isAllDiskssLoading,
  } = useAllDisks((disk) => {
    return {
      ...disk,
      alias: disk?.alias ?? '',
      id: disk?.id ?? '',
      icon1: <FontAwesomeIcon icon={faChevronLeft} fixedWidth />, 
      icon2: <FontAwesomeIcon icon={faChevronLeft} fixedWidth />,
      connectionTarget: disk?.connectionTarget ?? '',
      storageDomainVo: disk?.storageDomainVo?.name ?? '',
      virtualSize: disk?.virtualSize ?? '알 수 없음',
      status: disk?.status ?? '',
      storageType: disk?.storageType ?? '',
      description: disk?.description ?? '',
    };
  });


  const handleRowClick = (row, column, colIndex) => {
    if (colIndex === 0) {
      navigate(`/storages/disks/${row.id}`);  // 1번 컬럼 클릭 시 이동할 경로
    }
  }

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faDatabase}
        title="스토리지"
        subtitle=""
        buttons={[]} 
        popupItems={[]} 
        togglePopup={() => {}}
      />
       <div className="host_btn_outer">
       <Path pathElements={pathData} />
       <>
                <div className="disk_type">

                  <div>
                    <div className='flex'>
                      <span>디스크유형 : </span>
                      <div className='flex'>
                        <button className={activeDiskType === 'all' ? 'active' : ''} onClick={() => handleDiskTypeClick('all')}>모두</button>
                        <button className={activeDiskType === 'image' ? 'active' : ''} onClick={() => handleDiskTypeClick('image')}>이미지</button>
                        <button style={{ marginRight: '0.2rem' }} className={activeDiskType === 'lun' ? 'active' : ''} onClick={() => handleDiskTypeClick('lun')}>직접 LUN</button>
                      </div>
                    </div>
                    <div className="content_type">
                      <label className='mr-1' htmlFor="contentType">컨텐츠 유형:</label>
                      <select id="contentType" value={activeContentType} onChange={handleContentTypeChange}>
                        <option value="all">모두</option>
                        <option value="data">데이터</option>
                        <option value="ovfStore">OVF 스토어</option>
                        <option value="memoryDump">메모리 덤프</option>
                        <option value="iso">ISO</option>
                        <option value="hostedEngine">Hosted Engine</option>
                        <option value="sanlock">Hosted Engine Sanlock</option>
                        <option value="metadata">Hosted Engine Metadata</option>
                        <option value="conf">Hosted Engine Conf.</option>
                      </select>
                    </div>
                  </div>

                  <div className="header_right_btns">
                    <button onClick={() => openPopup('newDisk')}>새로 만들기</button>
                    <button onClick={() => openPopup('disk_edit')}>수정</button>
                    <button onClick={() => openPopup('delete')}>제거</button>
                    <button onClick={() => openPopup('move')}>이동</button>
                    <button onClick={() => openPopup('copy')}>복사</button>
                    <button onClick={() => openPopup('uploadDisk')}>업로드</button>
                    <button disabled>다운로드</button>
                  </div>
                </div>

                {activeDiskType === 'all' && (
                  <TableOuter 
                    columns={TableColumnsInfo.ALL_DISK}
                    data={allDisks}
                    onRowClick={handleRowClick}
                    showSearchBox={true}
                    clickableColumnIndex={[0]} 
                  />
                )}

                {activeDiskType === 'image' && (
                  <TableOuter 
                    columns={TableColumnsInfo.IMG_DISK}
                    data={allDisks}
                    onRowClick={handleRowClick}
                    showSearchBox={true}
                  />
                )}

              {/*
                {activeDiskType === 'lun' && (
                  <TableOuter 
                    columns={TableColumnsInfo.LUN_DISK}
                    data={allDisks}
                    onRowClick={handleRowClick}
                    showSearchBox={true}
                  />
                )}
                */}
              </>
        </div>
      <Footer/>

      {/*디스크(업로드)팝업 */}
      <Modal
        isOpen={activePopup === 'uploadDisk'}
        onRequestClose={closePopup}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="storage_disk_upload_popup">
          <div className="popup_header">
            <h1>이미지 업로드</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
          <div className="storage_upload_first">
            <button>파일 선택</button>
            <div>선택된 파일 없음</div>
          </div>
          <div className="storage_upload_second">
            <div className="disk_option">디스크 옵션</div>
            <div className="disk_new_img" style={{ paddingTop: '0.4rem' }}>
              <div className="disk_new_img_left">
                <div className="img_input_box">
                  <span>크기(GIB)</span>
                  <input type="text" disabled />
                </div>
                <div className="img_input_box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img_input_box">
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img_select_box">
                  <label htmlFor="data_hub">데이터 센터</label>
                  <select id="data_hub">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="storage_zone">스토리지 도메인</label>
                  <select id="storage_zone">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="disk_pattern">디스크 프로파일</label>
                  <select id="disk_pattern">
                    <option value="nfs_storage">NFS-Storage</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="compute_unit">호스트</label>
                  <select id="compute_unit">
                    <option value="host01">host01.ititinfo.com</option>
                  </select>
                </div>
              </div>
              <div className="disk_new_img_right">
                <div>
                  <input type="checkbox" id="reset_after_deletion" />
                  <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
                </div>
                <div>
                  <input type="checkbox" className="shareable" />
                  <label htmlFor="shareable">공유 가능</label>
                </div>
                <div style={{ marginBottom: '0.4rem' }}>
                  <input type="checkbox" id="incremental_backup" defaultChecked />
                  <label htmlFor="incremental_backup">중복 백업 사용</label>
                </div>
                <div>
                  <button>연결 테스트</button>
                </div>
              </div>
            </div>
          </div>
          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>
        {/*디스크(새로만들기)팝업 */}
        <Modal
      isOpen={activePopup === 'newDisk'}
      onRequestClose={closePopup}
      contentLabel="새 가상 디스크"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage_disk_new_popup">
        <div className="popup_header">
          <h1>새 가상 디스크</h1>
          <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
        </div>
        <div className="disk_new_nav">
          <div
            id="storage_img_btn"
            onClick={() => handleTabClick('img')}
            className={activeTab === 'img' ? 'active' : ''}
          >
            이미지
          </div>
          <div
            id="storage_directlun_btn"
            onClick={() => handleTabClick('directlun')}
            className={activeTab === 'directlun' ? 'active' : ''}
          >
            직접LUN
          </div>
          
        </div>
        {/*이미지*/}
        {activeTab === 'img' && (
          <div className="disk_new_img">
            <div className="disk_new_img_left">
              <div className="img_input_box">
                <span>크기(GIB)</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>별칭</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>설명</span>
                <input type="text" />
              </div>
              <div className="img_select_box">
                <label htmlFor="os">데이터 센터</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">스토리지 도메인</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">할당 정책</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">디스크 프로파일</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
            <div className="disk_new_img_right">
              <div>
                <input type="checkbox" id="reset_after_deletion" />
                <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
              </div>
              <div>
                <input type="checkbox" className="shareable" />
                <label htmlFor="shareable">공유 가능</label>
              </div>
              <div>
                <input type="checkbox" id="incremental_backup" defaultChecked />
                <label htmlFor="incremental_backup">중복 백업 사용</label>
              </div>
            </div>
          </div>
        )}
        {/*직접LUN*/}
        {activeTab === 'directlun' && (
          <div id="storage_directlun_outer">
            <div id="storage_lun_first">
              <div className="disk_new_img_left">
                <div className="img_input_box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img_input_box">
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">데이터 센터</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">호스트</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">스토리지 타입</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
              </div>
              <div className="disk_new_img_right">
                <div>
                  <input type="checkbox" className="shareable" />
                  <label htmlFor="shareable">공유 가능</label>
                </div>
              </div>
            </div>
          </div>
        )}
        {/*관리되는 블록 (삭제예정)*/}
        {/* {activeTab === 'managed' && (
          <div id="storage_managed_outer">
            <div id="disk_managed_block_left">
              <div className="img_input_box">
                <span>크기(GIB)</span>
                <input type="text" disabled />
              </div>
              <div className="img_input_box">
                <span>별칭</span>
                <input type="text" value="on20-ap01_Disk1" disabled />
              </div>
              <div className="img_input_box">
                <span>설명</span>
                <input type="text" disabled />
              </div>
              <div className="img_select_box">
                <label htmlFor="data_center_select">데이터 센터</label>
                <select id="data_center_select" disabled>
                  <option value="dc_linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="storage_domain_select">스토리지 도메인</label>
                <select id="storage_domain_select" disabled>
                  <option value="sd_linux">Linux</option>
                </select>
              </div>
              <span>해당 데이터 센터에 디스크를 생성할 수 있는 권한을 갖는 사용 가능한 관리 블록 스토리지 도메인이 없습니다.</span>
            </div>
            <div id="disk_managed_block_right">
              <div>
                <input type="checkbox" id="disk_shared_option" disabled />
                <label htmlFor="disk_shared_option">공유 가능</label>
              </div>
            </div>
          </div>
        )} */}
        <div className="edit_footer">
          <button style={{ display: 'none' }}></button>
          <button>OK</button>
          <button onClick={closePopup}>취소</button>
        </div>
      </div>
      </Modal>
      {/*디스크(편집)팝업 */}
      <Modal
      isOpen={activePopup === 'disk_edit'}
      onRequestClose={closePopup}
      contentLabel="새 가상 디스크"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage_disk_new_popup">
        <div className="popup_header">
          <h1>새 가상 디스크</h1>
          <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
        </div>
        <div className="disk_new_nav">
          <div
            id="storage_img_btn"
            onClick={() => handleTabClick('img')}
            className={activeTab === 'img' ? 'active' : ''}
          >
            이미지
          </div>
          <div
            id="storage_directlun_btn"
            onClick={() => handleTabClick('directlun')}
            className={activeTab === 'directlun' ? 'active' : 'disabled'}
          >
            직접LUN
          </div>
          
        </div>
        {/*이미지*/}
        {activeTab === 'img' && (
          <div className="disk_new_img">
            <div className="disk_new_img_left">
              <div className="img_input_box">
                <span>크기(GIB)</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>별칭</span>
                <input type="text" />
              </div>
              <div className="img_input_box">
                <span>설명</span>
                <input type="text" />
              </div>
              <div className="img_select_box">
                <label htmlFor="os">데이터 센터</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">스토리지 도메인</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">할당 정책</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img_select_box">
                <label htmlFor="os">디스크 프로파일</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
            <div className="disk_new_img_right">
              <div>
                <input type="checkbox" id="reset_after_deletion" />
                <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
              </div>
              <div>
                <input type="checkbox" className="shareable" />
                <label htmlFor="shareable">공유 가능</label>
              </div>
              <div>
                <input type="checkbox" id="incremental_backup" defaultChecked />
                <label htmlFor="incremental_backup">중복 백업 사용</label>
              </div>
            </div>
          </div>
        )}
        {/*직접LUN*/}
        {activeTab === 'directlun' && (
          <div id="storage_directlun_outer">
            <div id="storage_lun_first">
              <div className="disk_new_img_left">
                <div className="img_input_box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img_input_box">
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">데이터 센터</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">호스트</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img_select_box">
                  <label htmlFor="os">스토리지 타입</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
              </div>
              <div className="disk_new_img_right">
                <div>
                  <input type="checkbox" className="shareable" />
                  <label htmlFor="shareable">공유 가능</label>
                </div>
              </div>
            </div>
          </div>
        )}
       
        <div className="edit_footer">
          <button style={{ display: 'none' }}></button>
          <button>OK</button>
          <button onClick={closePopup}>취소</button>
        </div>
      </div>
      </Modal>
        {/*디스크(삭제)팝업 */}
      <Modal
        isOpen={activePopup === 'delete'}
        onRequestClose={closePopup}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="storage_delete_popup">
          <div className="popup_header">
            <h1>삭제</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
         
          <div className='disk_delete_box'>
            <div>
              <FontAwesomeIcon style={{marginRight:'0.3rem'}} icon={faExclamationTriangle} />
              <span>다음 항목을 삭제하시겠습니까?</span>
            </div>
          </div>


          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>
       {/*디스크(이동)팝업 */}
       <Modal
        isOpen={activePopup === 'move'}
        onRequestClose={closePopup}
        contentLabel="디스크 이동"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="disk_move_popup">
          <div className="popup_header">
            <h1>디스크 이동</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>

          <div className="section_table_outer py-1">
              <table >
        <thead>
          <tr>
            <th>별칭</th>
            <th>가상 크기</th>
            <th>소스</th>
            <th>대상</th>
            <th>디스크 프로파일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>he_sanlock</td>
            <td>1 GiB</td>
            <td>hosted_storage</td>
            <td>
              <select>
                <option>NFS (499 GiB)</option>
                <option>Option 2</option>
              </select>
            </td>
            <td>
              <select>
                <option>NFS</option>
                <option>Option 2</option>
              </select>
            </td>
          </tr>
        </tbody>
              </table>
          </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>
        {/*디스크(복사)팝업 */}
        <Modal
        isOpen={activePopup === 'copy'}
        onRequestClose={closePopup}
        contentLabel="디스크 복사"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="disk_move_popup">
          <div className="popup_header">
            <h1>디스크 복사</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>

          <div className="section_table_outer py-1">
              <table >
                <thead>
                  <tr>
                    <th>별칭</th>
                    <th>가상 크기</th>
                    <th>소스</th>
                    <th>대상</th>
                    <th>디스크 프로파일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input type='text' value={'별칭'}/>
                    </td>
                    <td>1 GiB</td>
                    <td>
                      <select>
                        <option>hosted_storage</option>
                     
                      </select>
                    </td>
                    <td>
                      <select>
                        <option>NFS (499 GiB)</option>
                        <option>Option 2</option>
                      </select>
                    </td>
                    <td>
                      <select>
                        <option>NFS</option>
                     
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
      </Modal>
    </div>
    
  );

};
export default AllDisk;
