// import React, { useState,useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import Modal from 'react-modal';
// import NavButton from '../navigation/NavButton';
// import HeaderButton from '../button/HeaderButton';
// import Table from '../table/Table';
// import TableColumnsInfo from '../table/TableColumnsInfo';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faTimes, faChevronCircleRight, 
//   faGlassWhiskey,
//   faExclamationTriangle,
//   faCloud
// } from '@fortawesome/free-solid-svg-icons'
// import './css/StorageDomainDetail.css';
// import TableOuter from '../table/TableOuter';
// import Footer from '../footer/Footer';
// import Path from '../Header/Path';
// import PagingTableOuter from '../table/PagingTableOuter';
// import { useAllDataCenterFromDomain, useAllDiskFromDomain, useAllDiskSnapshotFromDomain, useAllEventFromDomain, useAllTemplateFromDomain, useDomainById } from '../../api/RQHook';
// import EventDu from '../duplication/EventDu';
// import DomainGeneral from './domainjs/DomainGeneral';
// import DomainDatacenter from './domainjs/DomainDatacenter';
// import DomainVm from './domainjs/DomainVm';
// import DomainDisk from './domainjs/DomainDisk';
// import DomainDiskSnaphot from './domainjs/DomainDiskSnaphot';
// import DomainTemplate from './domainjs/DomainTemplate';
// import DomainEvent from './domainjs/DomainEvent';

// function StorageDomain({ togglePopupBox, isPopupBoxVisible, handlePopupBoxItemClick }) {
//   // url값 바꿔주기 section에따라
//   const {id, name,section } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState('general');

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     if (tab !== 'general') {
//       navigate(`/storages/domains/${id}/${tab}`);
//     } else {
//       navigate(`/storages/domains/${id}`);
//     }
//   };

//   useEffect(() => {
//     if (!section) {
//       setActiveTab('general');
//     } else {
//       setActiveTab(section);
//     }
//   }, [section]);
  


//     //클릭한 이름 받아오기
//     const handlePermissionFilterClick = (filter) => {
//       setActivePermissionFilter(filter);
//     };
//     const [storageType, setStorageType] = useState('NFS'); // 기본값은 NFS로 설정
//     // 스토리지 유형 변경 핸들러
//   const handleStorageTypeChange = (e) => {
//     setStorageType(e.target.value); // 선택된 옵션의 값을 상태로 저장
//   };
//     const [activePopup, setActivePopup] = useState(null); // modal
//     const [activePermissionFilter, setActivePermissionFilter] = useState('all');
//     const openModal = (popupType) => setActivePopup(popupType);
//     const closeModal = () => setActivePopup(null);
//     const [isDomainHiddenBoxVisible, setDomainHiddenBoxVisible] = useState(false);
//     const toggleDomainHiddenBox = () => {
//       setDomainHiddenBoxVisible(!isDomainHiddenBoxVisible);
//     };
//     const [isDomainHiddenBox2Visible, setDomainHiddenBox2Visible] = useState(false);
//     const toggleDomainHiddenBox2 = () => {
//       setDomainHiddenBox2Visible(!isDomainHiddenBox2Visible);
//     };
//     const [isDomainHiddenBox4Visible, setDomainHiddenBox4Visible] = useState(false);
//     const toggleDomainHiddenBox4 = () => {
//       setDomainHiddenBox4Visible(!isDomainHiddenBox4Visible);
//     };
//     const [isDomainHiddenBox5Visible, setDomainHiddenBox5Visible] = useState(false);
//     const toggleDomainHiddenBox5 = () => {
//       setDomainHiddenBox5Visible(!isDomainHiddenBox5Visible);
//     };
//     const handleRowClick = (row, column) => {
//       if (column.accessor === 'domainName') {
//         navigate(`/storage-domain/${row.domainName.props.children}`);  
//       }
//     };
//     const [activeLunTab, setActiveLunTab] = useState('target_lun'); 
//   const handleLunTabClick = (tab) => {
//     setActiveLunTab(tab); 
//   };
   
//   // 가상머신 박스떨어지게
//   // const [isFirstRowExpanded, setFirstRowExpanded] = useState(false);
//   // const [isSecondRowExpanded, setSecondRowExpanded] = useState(false);
//   // const toggleFirstRow = () => {
//   //   setFirstRowExpanded(!isFirstRowExpanded);
//   // };
//   // const toggleSecondRow = () => {
//   //   setSecondRowExpanded(!isSecondRowExpanded);
//   // };


// //임시(팝업데이터)
//   const data = [
//     {
//       alias: (
//         <span
//           style={{ color: 'blue', cursor: 'pointer' }}
//           onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
//           onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
//         >
//           he_metadata
//         </span>
//       ),
//       id: '289137398279301798',
//       icon1: '',
//       icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
//       connectionTarget: 'on20-ap01',
//       storageDomain: 'VirtIO-SCSI',
//       virtualSize: '/dev/sda',
//       status: 'OK',
//       type: '이미지',
//       description: '',
//     },
//     {
//       alias: (
//         <span
//           style={{ color: 'blue', cursor: 'pointer'}}
//           onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
//           onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
//         >
//           디스크2
//         </span>
//       ),
//       id: '289137398279301798',
//       icon1: '',
//       icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
//       connectionTarget: 'on20-ap01',
//       storageDomain: 'VirtIO-SCSI',
//       virtualSize: '/dev/sda',
//       status: 'OK',
//       type: '이미지',
//       description: '',
//     },
//     {
//       alias: (
//         <span
//           style={{ color: 'blue', cursor: 'pointer'}}
//           onMouseEnter={(e) => (e.target.style.fontWeight = 'bold')}
//           onMouseLeave={(e) => (e.target.style.fontWeight = 'normal')}
//         >
//           디스크3
//         </span>
//       ),
//       id: '289137398279301798',
//       icon1: '',
//       icon2: <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth/>,
//       connectionTarget: 'on20-ap01',
//       storageDomain: 'VirtIO-SCSI',
//       virtualSize: '/dev/sda',
//       status: 'OK',
//       type: '이미지',
//       description: '',
//     },
//   ];



//   // 옵션박스 열고닫기
//   // const [isUploadOptionBoxVisible, setUploadOptionBoxVisible] = useState(false);
//   // const toggleUploadOptionBox = () => {
//   //   setUploadOptionBoxVisible(!isUploadOptionBoxVisible);
//   // };
//   // 바탕클릭하면 옵션박스 닫기
//   // useEffect(() => {
//   //   const handleClickOutside = (event) => {
//   //     if (
//   //       isUploadOptionBoxVisible &&
//   //       !event.target.closest('.upload_option_box') &&
//   //       !event.target.closest('.upload_option_boxbtn')
//   //     ) {
//   //       setUploadOptionBoxVisible(false);
//   //     }
//   //   };
    
//   //   //
//   //   document.addEventListener('mousedown', handleClickOutside);
//   //   return () => {
//   //     document.removeEventListener('mousedown', handleClickOutside);
//   //   };
//   // }, [isUploadOptionBoxVisible]);
  
//   //일반
//   const [shouldRefresh, setShouldRefresh] = useState(false);
//   const { 
//     data: domain,
//     status: domainStatus,
//     isRefetching: isDomainRefetching,
//     refetch: domainRefetch, 
//     isError: isDomainError,
//     error: domainError, 
//     isLoading: isDomainLoading,
//   } = useDomainById(id);
//   useEffect(() => {
//     domainRefetch();
//     setShouldRefresh(false);
//   }, [shouldRefresh, domainRefetch]);

//   //데이터센터(???????정보안나옴)
//   // const { 
//   //   data: dataCenters, 
//   //   status: dataCentersStatus, 
//   //   isLoading: isDataCentersLoading, 
//   //   isError: isDataCentersError,
//   // } = useAllDataCenterFromDomain(domain?.id, toTableItemPredicateDataCenters);
//   // function toTableItemPredicateDataCenters(dataCenter) {
//   //   return {
//   //     id: dataCenter?.id ?? '없음',
//   //     name: dataCenter?.name ?? '',
//   //     status:dataCenter?.status ?? '',
//   //     domainTypeMaster: dataCenter?.domainTypeMaster ? '활성화' : '비활성화'
//   //   };
//   // }

//   //디스크
//   // const { 
//   //   data: disks, 
//   //   status: disksStatus, 
//   //   isLoading: isDisksLoading, 
//   //   isError: isDisksError,
//   // } = useAllDiskFromDomain(domain?.id, toTableItemPredicateDisks);
//   // function toTableItemPredicateDisks(disk) {
//   //   return {
//   //     alias: disk?.alias ?? '없음',  // 별칭
//   //     icon1: <FontAwesomeIcon icon={faChevronLeft} fixedWidth />, 
//   //     icon2: <FontAwesomeIcon icon={faChevronLeft} fixedWidth />,
//   //     virtualSize: disk?.virtualSize ? `${disk.virtualSize} GiB` : '알 수 없음', 
//   //     actualSize: disk?.actualSize ? `${disk.actualSize} GiB` : '알 수 없음',
//   //     allocationPolicy: disk?.allocationPolicy ?? '알 수 없음', 
//   //     storageDomain: disk?.storageDomain ?? '없음',  
//   //     creationDate: disk?.creationDate ?? '알 수 없음', 
//   //     lastUpdate: disk?.lastUpdate ?? '알 수 없음',
//   //     icon3: <FontAwesomeIcon icon={faChevronLeft} fixedWidth />, 
//   //     connectionTarget: disk?.connectionTarget ?? '없음',
//   //     status: disk?.status ?? '알 수 없음',
//   //     type: disk?.type ?? '알 수 없음', 
//   //     description: disk?.description ?? '없음', 
//   //   };
//   // }

//   //디스크 스냅샷
//   // const { 
//   //   data: diskSnapshots, 
//   //   status: diskSnapshotsStatus, 
//   //   isLoading: isDiskSnapshotsLoading, 
//   //   isError: isDiskSnapshotsError,
//   // } = useAllDiskSnapshotFromDomain(domain?.id, toTableItemPredicateDiskSnapshots);
//   // function toTableItemPredicateDiskSnapshots(diskSnapshot) {
//   //   return {
//   //     size: diskSnapshot?.size ? `${diskSnapshot.size} GiB` : '알 수 없음',
//   //     creationDate: diskSnapshot?.creationDate ?? '알 수 없음',
//   //     snapshotCreationDate: diskSnapshot?.snapshotCreationDate ?? '알 수 없음',
//   //     diskAlias: diskSnapshot?.diskAlias ?? '없음',
//   //     snapshotDescription: diskSnapshot?.snapshotDescription ?? '없음',
//   //     target: diskSnapshot?.target ?? '없음',
//   //     status: diskSnapshot?.status ?? '알 수 없음',
//   //     diskSnapshotId: diskSnapshot?.diskSnapshotId ?? '없음',
//   //   };
//   // }

//   //템플릿
//   // const { 
//   //   data: templates, 
//   //   status: templatesStatus, 
//   //   isLoading: isTemplatesLoading, 
//   //   isError: isTemplatesError,
//   // } = useAllTemplateFromDomain(domain?.id, toTableItemPredicateTemplates);
//   // function toTableItemPredicateTemplates(template) {
//   //   return {
//   //     alias: template?.alias ?? '없음',
//   //     disk: template?.disk ?? '없음',
//   //     virtualSize: template?.virtualSize ? `${template.virtualSize} GiB` : '알 수 없음',
//   //     actualSize: template?.actualSize ? `${template.actualSize} GiB` : '알 수 없음',
//   //     creationDate: template?.creationDate ?? '알 수 없음',
//   //   };
//   // }

//   // 이벤트
//   // const { 
//   //   data: events, 
//   //   status: eventsStatus, 
//   //   isLoading: isEventsLoading, 
//   //   isError: isEventsError 
//   // } = useAllEventFromDomain(domain?.id, toTableItemPredicateEvents);
//   // function toTableItemPredicateEvents(event) {
//   //   return {
//   //     icon: '',                      
//   //     time: event?.time ?? '',                
//   //     description: event?.description ?? 'No message', 
//   //     correlationId: event?.correlationId ?? '',
//   //     source: event?.source ?? 'ovirt',     
//   //     userEventId: event?.userEventId ?? '',   
//   //   };
//   // }

//   // ...버튼
//   const [popupOpen, setPopupOpen] = useState(false);
//   const togglePopupMenu = () => {
//     setPopupOpen(!popupOpen);
//   };
//   const buttons = [
//     { id: 'manageDomain_btn', label: '도메인 관리', onClick: () => openModal('manageDomain') },
//     { id: 'delete_btn', label: '삭제', onClick: () => openModal('delete') },
//     { id: 'connections_btn', label: 'Connections', onClick: () => console.log('Connections button clicked') }
//   ];
//   const popupItems = [
//     { label: <div className="disabled">OVF 업데이트</div>, onClick: () => console.log('OVF 업데이트 clicked') },
//     { label: <div className="disabled">파괴</div>, onClick: () => console.log('파괴 clicked') },
//     { label: <div className="disabled">디스크 검사</div>, onClick: () => console.log('디스크 검사 clicked') },
//     { label: <div className="disabled">마스터 스토리지 도메인으로 선택</div>, onClick: () => console.log('마스터 스토리지 도메인으로 선택 clicked') },
//   ];
//   const sections = [
//     { id: 'general', label: '일반' },
//     { id: 'dataCenters', label: '데이터 센터' },
//     { id: 'vms', label: '가상머신' },
//     { id: 'disks', label: '디스크' },
//     { id: 'diskSnapshots', label: '디스크 스냅샷' },
//     { id: 'templates', label: '템플릿' },
//     { id: 'events', label: '이벤트' },
//   ];

//   const pathData = [domain?.name, sections.find(section => section.id === activeTab)?.label];
//   const renderSectionContent = () => {
//     switch (activeTab) {
//       case 'general':
//         return <DomainGeneral domain={domain} />;
//       case 'dataCenters':
//         return <DomainDatacenter domain={domain} />;
//       case 'vms':
//         return <DomainVm domain={domain} />;
//       case 'disks':
//         return <DomainDisk domain={domain} />;  
//       case 'diskSnapshots':
//         return <DomainDiskSnaphot domain={domain} />;
//       case 'templates':
//         return <DomainTemplate domain={domain} />;
//       case 'events':
//         return <DomainEvent domain={domain} />;
//       default:
//         return <DomainGeneral domain={domain} />;
//     }
//   };


//   return (
//     <div className="content_detail_section">
//       <HeaderButton
//       titleIcon={faCloud}
//       title={domain?.name}
//       buttons={buttons}
//       popupItems={popupItems}
//     />

//       <div className="content_outer">
//         <NavButton 
//           sections={sections} 
//           activeSection={activeTab} 
//           handleSectionClick={handleTabClick} 
//         />
//         <div className="host_btn_outer">
          
//         <Path pathElements={pathData}/>
//         {renderSectionContent()}
//         {/* {activeTab === 'general' && (
//           <>
//           <div className="header_right_btns">
//             <button onClick={() => openModal('manageDomain')}>도메인 관리</button>
//             <button onClick={() => openModal('delete')}>삭제</button>
//             <button onClick={() => console.log('Connections button clicked')}>Connections</button>
         
//           </div>
//           <div className="tables">
//             <div className="table_storage_domain_detail">
//             <table className="table">
//               <tbody>
//                 <tr>
//                   <th>ID:</th>
//                   <td>{domain?.id}</td>
//                 </tr>
//                 <tr>
//                   <th>크기:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>사용 가능:</th>
//                   <td>{domain?.availableSize}</td>
//                 </tr>
//                 <tr>
//                   <th>사용됨:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>할당됨:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>오버 할당 비율:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>이미지:</th>
//                   <td>{domain?.image}</td>
//                 </tr>
//                 <tr>
//                   <th>경로:</th>
//                   <td>{domain?.storageAddress}</td>
//                 </tr>
//                 <tr>
//                   <th>NFS 버전:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>디스크 공간 부족 경고 표시:</th>
//                   <td>#</td>
//                 </tr>
//                 <tr>
//                   <th>심각히 부족한 디스크 공간의 동작 차단:</th>
//                   <td>#</td>
//                 </tr>
//               </tbody>
//             </table>

//             </div> 
//           </div> 
//           </>
//         )} */}

//         {/* {activeTab === 'datacenters' && (
//           <>
           
//               <div className="header_right_btns">
//                 <button className='disabled'>연결</button>
//                 <button className='disabled'>분리</button>
//                 <button className='disabled'>활성</button>
//                 <button onClick={() => openModal('maintenance')}>유지보수</button>
//               </div>
              
//               <TableOuter 
//                 columns={TableColumnsInfo.STORAGE_DOMAIN_FROM_DATACENTER}
//                 data={dataCenters} 
//                 onRowClick={() => console.log('Row clicked')} 
//               />
//           </>
//         )} */}

        
//         {/* {activeTab === 'vms' && (
//           <>
//  <div className="host_empty_outer">
//       <div className="section_table_outer">
//         <table>
//           <thead>
//             <tr>
//               <th>별칭</th>
//               <th>디스크</th>
//               <th>템플릿</th>
//               <th>가상 크기</th>
//               <th>실제 크기</th>
//               <th>생성 일자</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td onClick={toggleFirstRow} style={{ cursor: 'pointer' }}>
//                 <FontAwesomeIcon icon={isFirstRowExpanded ? faMinusCircle : faPlusCircle} fixedWidth />
//                 <FontAwesomeIcon icon={faDesktop} fixedWidth style={{ margin: '0 5px 0 10px' }} />
//                 test02
//               </td>
//               <td>1</td>
//               <td>Blank</td>
//               <td>1 GIB</td>
//               <td>5 GIB</td>
//               <td>2024.1.19 AM9:21:57</td>
//             </tr>
//           </tbody>

          
//           {isFirstRowExpanded && (
//             <>
//               <tbody className="detail_machine_second">
//                 <tr>
//                   <td onClick={toggleSecondRow} style={{ cursor: 'pointer' }}>
//                     <FontAwesomeIcon icon={isSecondRowExpanded ? faMinusCircle : faPlusCircle} fixedWidth style={{ marginLeft: ' 15px' }}/>
//                     <FontAwesomeIcon icon={faDesktop} fixedWidth style={{ margin: ' 0 5px 0 5px' }} />
//                     he_virtio_disk
//                   </td>
//                   <td>90 GIB</td>
//                   <td>5 GIB</td>
//                   <td>90 GIB</td>
//                   <td>5 GIB</td>
//                   <td>2023.12.28 11:58:49</td>
//                 </tr>
//               </tbody>

              
//               {isSecondRowExpanded && (
//                 <tbody className="detail_machine_last">
//                   <tr>
//                     <td>
//                       <FontAwesomeIcon icon={faDesktop} fixedWidth style={{ margin: '0 5px 0 50px' }} />
//                       Active VM
//                     </td>
//                     <td>90 GIB</td>
//                     <td>5 GIB</td>
//                     <td>90 GIB</td>
//                     <td>5 GIB</td>
//                     <td>2023.12.28 11:58:49</td>
//                   </tr>
//                 </tbody>
//               )}
//             </>
//           )}
//         </table>
//       </div>
//     </div>
//           </>
//         )} */}

//         {/* {activeTab === 'disks' && (
//         <>
//             <div className="header_right_btns">
//                 <button  onClick={() => openModal('move')}>이동</button>
//                 <button  onClick={() => openModal('copy')}>복사</button>
//                 <button  onClick={() => openModal('delete')}>제거</button>
//                 <button className='upload_option_boxbtn'>업로드 
//                   <i class={faAngleDown} onClick={toggleUploadOptionBox}fixedWidth/>
//                 </button>
//                 <button>다운로드</button>
                
//                 {isUploadOptionBoxVisible &&(
//                 <div className='upload_option_box'>
//                   <div>시작</div>
//                   <div>취소</div>
//                   <div>일시정지</div>
//                   <div>다시시작</div>
//                 </div>
//                 )}
//             </div>
            
//             <TableOuter 
//               columns={TableColumnsInfo.DISK_FROM_DOMAIN}
//               data={disks}
//               onRowClick={() => console.log('Row clicked')}
//             />
//        </>
//         )} */}

//         {/* {activeTab === 'diskSnapshots' && (
//         <>
//             <div className="header_right_btns">
//                 <button onClick={() => openModal('delete')}>제거</button>
//             </div>
            
//             <TableOuter 
//               columns={TableColumnsInfo.DISK_SNAPSHOT_FROM_DOMAIN}
//               data={diskSnapshots}
//               onRowClick={() => console.log('Row clicked')}
//             />
//         </>
//         )} */}
//         {/* {activeTab === 'templates' && (
//           <>
//           <div className="host_empty_outer">
//             <TableOuter 
//               columns={TableColumnsInfo.TEMPLATE_FROM_DOMAIN}
//               data={templates}
//               onRowClick={() => console.log('Row clicked')} 
//             />
//           </div>
//         </>
//         )} */}
//         {/* {activeTab === 'events' && (
//           <EventDu 
//           columns={TableColumnsInfo.EVENTS}
//           data={events}
//           handleRowClick={() => console.log('Row clicked')}
//       />
//         )} */}

//         {/* 권한(삭제예정)*/}
//         {/* {activeTab === 'permission' && (
//             <>
//             <div className="header_right_btns">
//             <button onClick={() => openModal('permission')}>추가</button>
//               <button onClick={() => openModal('delete')}>제거</button>
//             </div>
//             <div className="host_filter_btns">
//               <span>Permission Filters:</span>
//               <div>
//                 <button
//                   className={activePermissionFilter === 'all' ? 'active' : ''}
//                   onClick={() => handlePermissionFilterClick('all')}
//                 >
//                   All
//                 </button>
//                 <button
//                   className={activePermissionFilter === 'direct' ? 'active' : ''}
//                   onClick={() => handlePermissionFilterClick('direct')}
//                 >
//                   Direct
//                 </button>
//               </div>
//             </div>
//             <TableOuter
//               columns={TableColumnsInfo.PERMISSIONS}
//               data={activePermissionFilter === 'all' ? permissionData : []}
//               onRowClick={() => console.log('Row clicked')}
//             />
//           </>
//         )} */}

//       </div>

//       </div>
//       {/*도메인(도메인 관리)팝업 */}
//       <Modal
//     isOpen={activePopup === 'manageDomain'}
//     onRequestClose={closeModal}
//     contentLabel="도메인 관리"
//     className="Modal"
//     overlayClassName="Overlay"
//     shouldCloseOnOverlayClick={false}
//       >
//         <div className="storage_domain_administer_popup">
//           <div className="popup_header">
//             <h1>도메인 관리</h1>
//             <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
//           </div>

//           <div className="storage_domain_new_first">
//                     <div className="domain_new_left">
//                     <div className="domain_new_select">
//                         <label htmlFor="data_hub_location">데이터 센터</label>
//                         <select id="data_hub_location">
//                         <option value="linux">Default(VS)</option>
//                         </select>
//                     </div>
//                     <div className="domain_new_select">
//                         <label htmlFor="domain_feature_set">도메인 기능</label>
//                         <select id="domain_feature_set">
//                             <option value="data">데이터</option>
//                             <option value="iso">ISO</option>
//                             <option value="export">내보내기</option>
//                         </select>
//                     </div>
//                     <div className="domain_new_select">
//                         <label htmlFor="storage_option_type">스토리지 유형</label>
//                         <select 
//                         id="storage_option_type"
//                         value={storageType}
//                         onChange={handleStorageTypeChange} // 선택된 옵션에 따라 상태 변경
//                         >
//                         <option value="NFS">NFS</option>
                
//                         <option value="iSCSI">iSCSI</option>
//                         <option value="fc">파이버 채널</option>
//                         </select>
//                     </div>
//                     <div className="domain_new_select" style={{ marginBottom: 0 }}>
//                         <label htmlFor="host_identifier">호스트</label>
//                         <select id="host_identifier">
//                         <option value="linux">host02.ititinfo.com</option>
//                         </select>
//                     </div>
//                     </div>
//                     <div className="domain_new_right">
//                     <div className="domain_new_select">
//                         <label>이름</label>
//                         <input type="text" />
//                     </div>
//                     <div className="domain_new_select">
//                         <label>설명</label>
//                         <input type="text" />
//                     </div>
//                     <div className="domain_new_select">
//                         <label>코멘트</label>
//                         <input type="text" />
//                     </div>
//                     </div>
//                 </div>

//                 {storageType === 'NFS' && (
//                 <div className="storage_popup_NFS">
//                     <div className ="network_form_group">
//                     <label htmlFor="data_hub">NFS 서버 경로</label>
//                     <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
//                     </div>

//                     <div>
//                     <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn" onClick={toggleDomainHiddenBox}fixedWidth/>
//                     <span>사용자 정의 연결 매개 변수</span>
//                     <div id="domain_hidden_box" style={{ display: isDomainHiddenBoxVisible ? 'block' : 'none' }}>
//                         <span>아래 필드에서 기본값을 변경하지 않을 것을 권장합니다.</span>
//                         <div className="domain_new_select">
//                         <label htmlFor="nfs_version">NFS 버전</label>
//                         <select id="nfs_version">
//                             <option value="host02_ititinfo_com">host02.ititinfo.com</option>
//                         </select>
//                         </div>
//                         {/* <div className="domain_new_select">
//                         <label htmlFor="data_hub">재전송</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label htmlFor="data_hub">제한 시간(데시세컨드)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label htmlFor="data_hub">추가 마운트 옵션</label>
//                         <input type="text" />
//                         </div> */}
//                     </div>
//                     </div>
//                     <div>
//                     <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn2" onClick={toggleDomainHiddenBox2}fixedWidth/>
//                     <span>고급 매개 변수</span>
//                     <div id="domain_hidden_box2" style={{ display: isDomainHiddenBox2Visible ? 'block' : 'none' }}>
//                         <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
//                         <input type="text" />
//                         </div>
//                         {/* <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
//                         <select id="format_type_selector" disabled>
//                             <option value="linux">V5</option>
//                         </select>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="reset_after_deletion"/>
//                         <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="backup_vault"/>
//                         <label htmlFor="backup_vault">백업</label>
//                         </div> */}

//                     </div>
//                     </div>
//                 </div>
//                 )}

                

//                 {storageType === 'iSCSI' && (
//                 <div className="storage_popup_NFS">
//                     <div className='target_btns flex'> 
//                     <button 
//                         className={`target_lun ${activeLunTab === 'target_lun' ? 'active' : ''}`}
//                         onClick={() => handleLunTabClick('target_lun')}
//                     >
//                         대상 - LUN
//                     </button>
//                     <button 
//                         className={`lun_target ${activeLunTab === 'lun_target' ? 'active' : ''}`}
//                         onClick={() => handleLunTabClick('lun_target')}
//                     > 
//                         LUN - 대상
//                     </button>
//                     </div>


                
//                     {activeLunTab === 'target_lun' &&(
//                     <div className='target_lun_outer'>
//                         <div className="search_target_outer">
//                         <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn4" onClick={toggleDomainHiddenBox4}fixedWidth/>
//                         <span>대상 검색</span>
//                         <div id="domain_hidden_box4" style={{ display: isDomainHiddenBox4Visible ? 'block' : 'none' }}>
//                             <div className="search_target ">

//                             <div>
//                                 <div className ="network_form_group">
//                                 <label htmlFor="data_hub">내보내기 경로</label>
//                                 <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
//                                 </div>
//                                 <div className ="network_form_group">
//                                 <label htmlFor="data_hub">내보내기 경로</label>
//                                 <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
//                                 </div>
//                             </div>

//                             <div>
//                                 <div className='input_checkbox'>
//                                 <input type="checkbox" id="reset_after_deletion"/>
//                                 <label htmlFor="reset_after_deletion">사용자 인증 :</label>
//                                 </div>
//                                 <div className ="network_form_group">
//                                 <label htmlFor="data_hub">내보내기 경로</label>
//                                 <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
//                                 </div>
//                                 <div className ="network_form_group">
//                                 <label htmlFor="data_hub">내보내기 경로</label>
//                                 <input type="text" placeholder="예:myserver.mydomain.com/my/local/path" />
//                                 </div>
//                             </div>

                            
//                             </div>
//                             <button>검색</button>
//                         </div>
//                         </div>
                    

//                         <div>
//                         <button className='all_login'>전체 로그인</button>
//                         <div className='section_table_outer'>
//                             <Table
//                             columns={TableColumnsInfo.CLUSTERS_ALT} 
//                             data={data} 
//                             onRowClick={handleRowClick}
//                             shouldHighlight1stCol={true}
//                             />
//                         </div>
//                         </div>
//                     </div>
//                     )}      

//                     {activeLunTab === 'lun_target' && (
//                     <div className='lun_target_outer'>
//                         <div className='section_table_outer'>
//                             <Table
//                             columns={TableColumnsInfo.CLUSTERS_ALT} 
//                             data={data} 
//                             onRowClick={handleRowClick}
//                             shouldHighlight1stCol={true}
//                             />
//                         </div>
//                     </div>
//                     )}
//                     <div>
//                     <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn5" onClick={toggleDomainHiddenBox5}fixedWidth/>
//                     <span>고급 매개 변수</span>
//                     <div id="domain_hidden_box5" style={{ display: isDomainHiddenBox5Visible ? 'block' : 'none' }}>
//                         <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
//                         <input type="text" />
//                         </div>

//                         {/* <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
//                         <select id="format_type_selector" disabled>
//                             <option value="linux">V5</option>
//                         </select>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="reset_after_deletion"/>
//                         <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="backup_vault"/>
//                         <label htmlFor="backup_vault">백업</label>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="backup_vault"/>
//                         <label htmlFor="backup_vault">삭제 후 폐기</label>
//                         </div> */}
//                     </div>
//                     </div>

//                 </div>
//                 )}

//                 {storageType === 'fc' && (
//                 <div className="storage_popup_NFS">
//                     <div className='section_table_outer'>
//                         <Table
//                         columns={TableColumnsInfo.CLUSTERS_ALT} 
//                         data={data} 
//                         onRowClick={handleRowClick}
//                         shouldHighlight1stCol={true}
//                         />
//                     </div>
//                     <div>
//                     <FontAwesomeIcon icon={faChevronCircleRight} id="domain_hidden_box_btn5" onClick={toggleDomainHiddenBox5}fixedWidth/>
//                     <span>고급 매개 변수</span>
//                     <div id="domain_hidden_box5" style={{ display: isDomainHiddenBox5Visible ? 'block' : 'none' }}>
//                         <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label>디스크 공간 부족 경고 표시(%)</label>
//                         <input type="text" />
//                         </div>
//                         <div className="domain_new_select">
//                         <label htmlFor="format_type_selector" style={{ color: 'gray' }}>포맷</label>
//                         <select id="format_type_selector" disabled>
//                             <option value="linux">V5</option>
//                         </select>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="reset_after_deletion"/>
//                         <label htmlFor="reset_after_deletion">삭제 후 초기화</label>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="backup_vault"/>
//                         <label htmlFor="backup_vault">백업</label>
//                         </div>
//                         <div className="hidden_checkbox">
//                         <input type="checkbox" id="backup_vault"/>
//                         <label htmlFor="backup_vault">삭제 후 폐기</label>
//                         </div>
//                     </div>
//                     </div>
//                 </div>
//                 )}

//           <div className="edit_footer">
//             <button style={{ display: 'none' }}></button>
//             <button>OK</button>
//             <button onClick={closeModal}>취소</button>
//           </div>
//         </div>
//       </Modal>

      
//         {/*삭제 팝업 */}
//         <Modal
//         isOpen={activePopup === 'delete'}
//         onRequestClose={closeModal}
//         contentLabel="디스크 업로드"
//         className="Modal"
//         overlayClassName="Overlay"
//         shouldCloseOnOverlayClick={false}
//       >
//         <div className="storage_delete_popup">
//           <div className="popup_header">
//             <h1>삭제</h1>
//             <button onClick={closeModal}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
//           </div>
         
//           <div className='disk_delete_box'>
//             <div>
//               <FontAwesomeIcon style={{marginRight:'0.3rem'}} icon={faExclamationTriangle} />
//               <span>다음 항목을 삭제하시겠습니까?</span>
//             </div>
//           </div>


//           <div className="edit_footer">
//             <button style={{ display: 'none' }}></button>
//             <button>OK</button>
//             <button onClick={closeModal}>취소</button>
//           </div>
//         </div>
//         </Modal>


//       <Footer/>
     
//     </div>
//   );
// }

// export default StorageDomain;
