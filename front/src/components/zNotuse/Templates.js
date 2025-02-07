import React, { useState,  useEffect } from 'react';
import { useNavigate,useParams,useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { useAllTemplates } from "../../api/RQHook";
import VmTemplateChart from '../../pages/computing/vm/VmTemplateChart';
import Table from "../../table/Table";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import HeaderButton from "../../button/HeaderButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faExclamationTriangle, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import Path from '../../Header/Path';
import TableOuter from '../table/TableOuter';

// 애플리케이션 섹션
const Templates = () => {
  const { id } = useParams(); // URL의 id 가져오기
  const location = useLocation(); // 현재 URL 경로 가져오기
  const [pathData, setPathData] = useState(['가상머신', '템플릿']); // 기본 경로 데이터
  const fetchNameById = async (id) => {
    // 서버에서 id로 이름을 가져오는 로직 구현
    return '템플릿 이름'; // 실제 구현 시 서버 응답 데이터로 대체
};
useEffect(() => {
  const previousPath = location.pathname.split('/').filter(Boolean); // 경로를 배열로 분할
  
  if (id) {
      // id가 있는 경우 id에 맞는 name을 가져와서 pathData에 설정
      const fetchTemplateName = async () => {
          const name = await fetchNameById(id); // id에 해당하는 이름을 가져오는 함수
          setPathData([...previousPath, name, '가상머신', '템플릿']);
      };
      fetchTemplateName();
  } else {
      setPathData([...previousPath, '가상머신', '템플릿']);
  }
}, [id, location.pathname]); // id나 경로가 변경될 때마다 실행
    const [activeSection, setActiveSection] = useState(null);
    const navigate = useNavigate();
    
  
    const [activePopup, setActivePopup] = useState(null);
    const [selectedModalTab, setSelectedModalTab] = useState('ipv4');
    const openPopup = (popupType) => {
      setActivePopup(popupType);
      if (popupType === 'edit') {
        setSelectedModalTab('general'); // 모달이 열릴 때 첫 번째 탭으로 설정
      }
    };
  
    const closePopup = () => {
      setActivePopup(null);
      setSelectedModalTab('general'); // 모달이 닫힐 때 첫 번째 탭으로 초기화
    };
  
      // // 편집 팝업
      //     useEffect(() => {
      //       const showEditPopup = () => {
      //           setActiveSection('common_outer');
      //           const editPopupBg = document.getElementById('edit_popup_bg');
      //           if (editPopupBg) {
      //               editPopupBg.style.display = 'block';
      //           }
      //       }
  
      //       const editButton = document.getElementById('network_first_edit_btn');
      //       if (editButton) {
      //           editButton.addEventListener('click', showEditPopup);
      //       }
  
      //       return () => {
      //           if (editButton) {
      //               editButton.removeEventListener('click', showEditPopup);
      //           }
      //       };
      //   }, []);
      //   // 편집 팝업 기본 섹션 스타일 적용
      //   useEffect(() => {
      //       const defaultElement = document.getElementById('common_outer_btn');
      //       if (defaultElement) {
      //           defaultElement.style.backgroundColor = '#EDEDED';
      //           defaultElement.style.color = '#1eb8ff';
      //           defaultElement.style.borderBottom = '1px solid blue';
      //       }
      //   }, []);
      //   // 편집 팝업 스타일 변경
      //   const handleSectionChange = (section) => {
      //       setActiveSection(section);
      //       const elements = document.querySelectorAll('.edit_aside > div');
      //       elements.forEach(el => {
      //           el.style.backgroundColor = '#FAFAFA';
      //           el.style.color = 'black';
      //           el.style.borderBottom = 'none';
      //       });
  
      //       const activeElement = document.getElementById(`${section}_btn`);
      //       if (activeElement) {
      //           activeElement.style.backgroundColor = '#EDEDED';
      //           activeElement.style.color = '#1eb8ff';
      //           activeElement.style.borderBottom = '1px solid blue';
      //       }
      //   };
      //   const showEditPopup = () => {
      //     setActiveSection('common_outer');
      //     const editPopupBg = document.getElementById('edit_popup_bg');
      //     if (editPopupBg) {
      //       editPopupBg.style.display = 'block';
      //     }
      // };
  
  
      // const buttons = [
      //   { id: 'bring_btn', label: '가져오기', onClick: () => openPopup('bring') },
      //   { id: 'edit_btn', label: '편집', onClick: () => openPopup('edit') },
      //   { id: 'delete_btn', label: '삭제', onClick: () => openPopup('delete') },
      //   { id: 'export_btn', label: '내보내기', className: 'disabled' },  // 내보내기 비활성화
      //   { id: 'new_vm_btn', label: '새 가상머신', className: 'disabled' },  // 새 가상머신 비활성화
      // ];
      


    const { 
        data: templates, 
        status: templatesStatus,
        isRefetching: isTemplatesRefetching,
        refetch: refetchTemplates, 
        isError: isTemplatesError, 
        error: templatesError, 
        isLoading: isTemplatesLoading,
      } = useAllTemplates(toTableItemPredicateTemplates);
      
      function toTableItemPredicateTemplates(template) {
        return {
          id: template?.id ?? '',
          name: template?.name ?? 'Unknown', 
          status: template?.status ?? '',                // 템플릿 상태
          versionName: template?.versionName ?? 'N/A',           // 템플릿 버전 정보
          description: template?.description ?? 'No description',// 템플릿 설명
          cluster: template?.clusterVo?.name ?? '', 
          datacenter: template?.dataCenterVo?.name ?? '', 
          creationTime: template?.creationTime ?? '',
          comment: template?.comment ?? ''
        };
      }
      
    return (
        <div id="section">
            <HeaderButton
            titleIcon={faDesktop}
            title=""
            subtitle=""
            buttons={[]}
            popupItems={[]}
            openModal={[]}
            togglePopup={() => {}}
            />
           
            <div className="content_outer">
           
                <div className="empty_nav_outer">
                <Path pathElements={pathData} />
                    {/* TODO: TableOuter화 */}
                <div className="section_table_outer">
                    {/* <div className='host_filter_btns'>
                        <button
                        onClick={() => {
                        navigate('/computing/vms'); // 가상머신 목록 경로로 이동
                        }}
                    >
                        가상머신 목록
                    </button>
                    <button
                        onClick={() => {
                            setActiveChart('template');
                            navigate('/computing/templates'); // 템플릿 목록 경로로 이동
                        }}
                        className={activeChart === 'template' ? 'active' : ''}
                        >
                        템플릿 목록
                        </button>
                    </div> */}
                    <div className="content_header_right">
                        <div className="search_box">
                            <input type="text" />
                            <button><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
                            <button><FontAwesomeIcon icon={faSearch} fixedWidth/></button>
                        </div>

                        <div className="header_right_btns">
                          <button  onClick={() => openPopup('edit')}>편집</button>
                          <button  onClick={() => openPopup('delete')}>삭제</button>
                          <button  onClick={() => openPopup('')}>새 가상머신</button>
                      </div>
                          
                    </div>
                    
                    <TableOuter 
                    columns={TableColumnsInfo.TEMPLATE_CHART} 
                    data={templates} 
                    className='template_chart'
                    clickableColumnIndex={[0]} 
                    onContextMenuItems={() => [
                      <div key="편집" onClick={() => openPopup('edit')}>편집</div>,
                      <div key="삭제" onClick={() => openPopup('delete')}>삭제</div>,
                      <div key="새 가상머신" onClick={() => openPopup('')}>새 가상머신</div>,
                    ]}
                    />
                    
                </div>
                </div>
            </div>
        {/*편집 모달 */}
        <Modal
            isOpen={activePopup === 'edit'}
            onRequestClose={closePopup} // 모달 닫기 핸들러 연결
            contentLabel="추가"
            className="Modal"
            overlayClassName="Overlay newRolePopupOverlay"
            shouldCloseOnOverlayClick={false}
        >
            <div className="template_eidt_popup">
            <div className="popup_header">
                <h1>템플릿 수정</h1>
                <button onClick={closePopup}>
                <FontAwesomeIcon icon={faTimes} fixedWidth />
                </button>
            </div>

            <div className='flex'>
                <div className="network_backup_edit_nav">
                <div
                    id="general_tab"
                    className={selectedModalTab === 'general' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('general')}
                >
                    일반
                </div>
                <div
                    id="console_tab"
                    className={selectedModalTab === 'console' ? 'active-tab' : 'inactive-tab'}
                    onClick={() => setSelectedModalTab('console')}
                >
                    콘솔
                </div>

                
                </div>

                {/* 탭 내용 */}
                <div className="backup_edit_content">
                {selectedModalTab === 'general' && 
                <>
                <div className="vnic_new_box" style={{borderBottom:'1px solid gray', paddingBottom:'0.3rem'}}>
                    <label htmlFor="ip_address">최적화 옵션</label>
                    <select id="ip_address">
                    <option value="서버">서버</option>
                    </select>
                </div>
                
                <div className='template_edit_texts'>
                    <div className='host_textbox'>
                    <label htmlFor="user_name">이름</label>
                    <input type="text" id="user_name" value={'#'} />
                    </div>
                    <div className='host_textbox'>
                    <label htmlFor="description">설명</label>
                    <input type="text" id="description" />
                    </div>
                    <div className='host_textbox'>
                    <label htmlFor="comment">코멘트</label>
                    <input type="text" id="comment" />
                    </div>
                </div>

                <div className='flex'>
                    <div className="vnic_new_checkbox">
                    <input type="checkbox" id="stateless" />
                    <label htmlFor="stateless">상태 비저장</label>
                    </div>
                    <div className="vnic_new_checkbox">
                    <input type="checkbox" id="start_in_pause_mode" />
                    <label htmlFor="start_in_pause_mode">일시정지 모드에서 시작</label>
                    </div>
                    <div className="vnic_new_checkbox">
                    <input type="checkbox" id="prevent_deletion" />
                    <label htmlFor="prevent_deletion">삭제 방지</label>
                    </div>
                </div>
                    
                    </>
                }
                {selectedModalTab === 'console' && 
                <>
                    <div className="vnic_new_box" style={{borderBottom:'1px solid gray', paddingBottom:'0.3rem'}}>
                    <label htmlFor="ip_address">최적화 옵션</label>
                    <select id="ip_address">
                        <option value="서버">서버</option>
                    </select>
                    </div>
                    <div className='p-1.5'>
                    <div className='font-bold'>그래픽 콘솔</div>
                    <div className='monitor'>
                        <label htmlFor="monitor_select">모니터</label>
                        <select id="monitor_select">
                        <option value="1">1</option>
                        </select>
                    </div>
                    </div>
                </>
                }
            
                
                </div>
            </div>

            <div className="edit_footer">
                <button style={{ display: 'none' }}></button>
                <button>OK</button>
                <button onClick={closePopup}>취소</button>
            </div>
            </div>
        </Modal>
        {/*가져오기 팝업 */}
        <Modal
        isOpen={activePopup === 'bring'}
        onRequestClose={closePopup}
        contentLabel="디스크 업로드"
        className="Modal"
        overlayClassName="Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <div className="vm_bring_popup">
          <div className="popup_header">
            <h1>가상머신 가져오기</h1>
            <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
          </div>
         
          <div className="border-b border-gray-400">
            <div className="vm_select_box">
                <label htmlFor="host_action">데이터 센터</label>
                <select id="host_action">
                    <option value="none">Default</option>
                </select>
            </div>
            <div className="vm_select_box">
                <label htmlFor="host_action">소스</label>
                <select id="host_action">
                    <option value="none">가상 어플라이언스(OVA)</option>
                </select>
            </div>
          </div>

          <div>
            <div className="vm_select_box">
                <label htmlFor="host_action">호스트</label>
                <select id="host_action">
                    <option value="none">Default</option>
                </select>
            </div>
            <div className="vm_select_box">
                <label htmlFor="host_action">파일 경로</label>
                <input type='text'/>
            </div>
          </div>
          <div className='px-1.5'>
            <div className='load_btn'>로드</div>
          </div>

        <div className='vm_bring_table'>

            <div>
                <div className='font-bold'>소스 상의 가상 머신</div>
                <TableOuter 
                    columns={TableColumnsInfo.VM_BRING_POPUP}
                    data={[]}
                    onRowClick={() => console.log('Row clicked')}
                />
            </div>
            <div>
                <div className='font-bold'>가져오기할 가상 머신</div>
                <TableOuter 
                    columns={TableColumnsInfo.VM_BRING_POPUP}
                    data={[]}
                    onRowClick={() => console.log('Row clicked')}
                />
            </div>

        </div>

          <div className="edit_footer">
            <button style={{ display: 'none' }}></button>
            <button>OK</button>
            <button onClick={closePopup}>취소</button>
          </div>
        </div>
        </Modal>
        {/*삭제 팝업 */}
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
        <h1>디스크 삭제</h1>
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
        </div>
          
    );
  };
  
  export default Templates;