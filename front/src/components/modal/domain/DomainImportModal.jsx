import React, { useState,useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import BaseModal from "../BaseModal";
import Tables from '../../../../components/table/Tables';
import TableColumnsInfo from '../../../../components/table/TableColumnsInfo';
import { 
  useAddDomain, 
  useAllDataCenters, 
  useDomainById, 
  useEditDomain ,
  useHostsFromDataCenter,
  useDataCenter,
  useIscsiFromHost,
  useFibreFromHost,
  useImportIscsiFromHost,
  useImportFcpFromHost,
  useImportDomain,
  useLoginIscsiFromHost,
} from '../../../../api/RQHook';
import '../css/MDomain.css'
import Localization from '../../../utils/Localization';

Modal.setAppElement('#root');

const FormGroup = ({ label, children }) => (
  <div className="domain-new-select">
    <label>{label}</label>
    {children}
  </div>
);

const DomainImportModal = ({ isOpen, editMode = false, domainId, datacenterId, onClose }) => {
  const { mutate: addDomain } = useAddDomain();
  const { mutate: editDomain } = useEditDomain();
  const { mutate: importDomain } = useImportDomain();
  const { mutate: importIscsiFromHost } = useImportIscsiFromHost(); // 가져오기 iscsi
  const { mutate: importFcpFromHost } = useImportFcpFromHost();   // 가져오기 fcp
  const { mutate: loginIscsiFromHost } = useLoginIscsiFromHost();  // 가져오기 iscsi 로그인

  const [formState, setFormState] = useState({
    id: '',
    domainType: 'data', // 기본값 설정
    storageType: 'nfs', // 기본값 설정
    name: '',    
    comment: '',
    description: '',
    warning: '10',
    spaceBlocker: '5',
  });
  const [dataCenterVoId, setDataCenterVoId] = useState('');  
  const [hostVoName, setHostVoName] = useState('');
  const [hostVoId, setHostVoId] = useState('');
  const [storageTypes, setStorageTypes] = useState([]);
  

  // nfs
  const [nfsAddress, setNfsAddress] = useState('');

  // iscsi, fibre
  const [lunId, setLunId] = useState('');

  // import
  // nfs 는 같음
  // iscsi 주소, 포트, 사용자 인증 이름, 암호 해서 검색
  
  const [target, setTarget] = useState('');
  const [address, setAddress] = useState('');
  const [port, setPort] = useState('');
  // const [chapName, setChapName] = useState('');
  // const [chapPassword, setChapPassword] = useState('');
  // const [useChap, setUseChap] = useState(false);

  
  const resetForm = () => {
    setFormState({
      id: '',
      domainType: 'data', // 도메인 유형 기본값 설정
      storageType: 'nfs', // 스토리지 유형 기본값 설정
      name: '',
      comment: '',
      description: '',
      warning: '10',
      spaceBlocker: '5',
    });
    // setStorageTypes(['nfs', 'iscsi', 'fcp']); // 기본 도메인 유형에 따른 스토리지 유형
    setIscsiSearchResults([]); // iSCSI 검색 결과 초기화
    setFcpSearchResults([]);   // FCP 검색 결과 초기화
    setNfsAddress('');
    setLunId('');
    setAddress('');
    setPort(3260);
  };


  // 도메인 데이터 가져오기
  const {
    data: domain,
    refetch: refetchDomain,
    isLoading: isDomainLoading,
  } = useDomainById(domainId);

  // 데이터센터 가져오기
  const {
    data: dataCenters = [],
    refetch: refetchDatacenters,
    isLoading: isDatacentersLoading
  } = useAllDataCenters((e) => ({...e,}));

  const {
    data: dataCenter,
    refetch: refetchDataCenter,
    isLoading: isDataCenterLoading,
  } = useDataCenter(datacenterId);

  // 호스트 가져오기
  const {
    data: hosts = [],
    refetch: refetchHosts,
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(dataCenterVoId ? dataCenterVoId : null, (e) => ({...e,}));

  // iscsi 목록 가져오기
  const {
    data: iscsis = [],
    refetch: refetchIscsis,
    error: isIscsisError,
    isLoading: isIscsisLoading,
  } = useIscsiFromHost(hostVoId ? hostVoId : null, ((e) => {
    const unit = e?.logicalUnits[0];
      return {
        ...e,
        abled: unit.storageDomainId === "" ? 'OK' : 'NO',
        target: unit.target,
        address: unit.address,
        port: unit.port,
        status: unit.status,
        size: (unit.size ? unit.size / (1024 ** 3): unit.size),
        paths: unit.paths,   
        productId: unit.productId,   
        vendorId: unit.vendorId,
        serial: unit.serial,
    };
  }));

  // fibre 목록 가져오기
  const {
    data: fibres = [],
    refetch: refetchFibres,
    error: isFibresError,
    isLoading: isFibresLoading,
  } = useFibreFromHost(hostVoId ? hostVoId : null, ((e) => {
    const unit = e?.logicalUnits[0];
    return {
      ...e,
      status: unit.status,
      size: (unit.size ? unit.size / (1024 ** 3): unit.size),
      paths: unit.paths,   
      productId: unit.productId,   
      vendorId: unit.vendorId,   
      serial: unit.serial
    };
  }));

  const isNfs = formState.storageType === 'nfs' || domain?.storageType === 'nfs';
  const isIscsi = formState.storageType === 'iscsi' || domain?.storageType === 'iscsi';
  const isFibre = formState.storageType === 'fcp' || domain?.storageType === 'fcp';

  const domainTypes = [
    { value: "data", label: "데이터" },
    { value: "iso", label: "ISO" },
    { value: "export", label: "내보내기" },
  ];

  const storageTypeOptions = (dType) => {
    switch (dType) {
      case 'iso':
      case 'export':
        return [{ value: 'nfs', label: 'NFS' }];
      default: // data
        return [
          { value: 'nfs', label: 'NFS' },
          { value: 'iscsi', label: 'ISCSI' },
          { value: 'fcp', label: 'Fibre Channel' },
        ];
    }
  };

  useEffect(() => {
    if (editMode && domain) {
      const updatedState = {
        id: domain.id || '',
        domainType: domain.domainType || '', 
        storageType: domain.storageType || '', 
        name: domain.name || '',    
        comment: domain.comment || '',
        description: domain.description || '',
        warning: domain.warning || '',
        spaceBlocker: domain.spaceBlocker || '',
      };
      setFormState(updatedState);
      setDataCenterVoId(domain?.dataCenterVo?.id || '');
      setHostVoId(domain?.hostVo?.id || '');
      setHostVoName(domain?.hostVo?.name || '');
      
      if (updatedState.storageType === 'nfs') {
        setNfsAddress(domain?.storageAddress || '');
      } else if (updatedState.storageType === 'iscsi' || updatedState.storageType === 'fcp') {
        setLunId(domain?.hostStorageVo?.logicalUnits[0]?.id || '');
      }
    } else if (!editMode) {
      resetForm();
    }
  }, [editMode, domain]);  
  
  
  useEffect(() => {
    if (!editMode && dataCenters && dataCenters.length > 0) {
      setDataCenterVoId(dataCenters[0].id);
    }
  }, [dataCenters, editMode]);
  
  useEffect(() => {
    if (!editMode && hosts && hosts.length > 0) {
      setHostVoName(hosts[0].name);
      setHostVoId(hosts[0].id);
    }
  }, [hosts, editMode]);  

  useEffect(() => {
    const options = storageTypeOptions(formState.domainType);
    setStorageTypes(options);
  
    // 기본 storageType을 options의 첫 번째 값으로 설정
    if (!editMode && options.length > 0) {
      setFormState((prev) => ({
        ...prev,
        storageType: options[0].value,
      }));
    }
  }, [formState.domainType, editMode]);
  

  useEffect(() => {
    // 스토리지 유형 변경 시 초기화할 상태 설정
    setNfsAddress('');
    setLunId('');
    setIscsiSearchResults([]); // iSCSI 검색 결과 초기화
    setFcpSearchResults([]);   // FCP 검색 결과 초기화
    setTarget('');             // 선택된 target 초기화
    setAddress('');            // iSCSI 주소 초기화
    setPort('3260');           // iSCSI 포트 기본값 초기화
  }, [formState.storageType]); // formState.storageType 변경 시 실행
    
  
  const handleRowClick = (row) => {
    console.log('선택한 행 데이터:', row);
    setLunId(row.id); // 선택된 LUN ID를 설정
    setTarget(row.target); // 선택된 target 값을 설정
    setAddress(row.address); // 선택된 address 값을 설정
    setPort(row.port); // 선택된 port 값을 설정
  };

  const validateForm = () => {
    if (!formState.name)
      return `${Localization.kr.NAME}을 입력해주세요.`;
    if (!dataCenterVoId) 
      return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (formState.storageType === 'NFS' && !nfsAddress) return '경로를 입력해주세요.';
    if (formState.storageType !== 'nfs' && lunId) {
      const selectedLogicalUnit =
        formState.storageType === 'iscsi'
          ? iscsis.find((iLun) => iLun.id === lunId)
          : fibres.find((fLun) => fLun.id === lunId);
      if (selectedLogicalUnit?.abled === 'NO') return '선택한 항목은 사용할 수 없습니다.';
    }
    return null;
  };

  const [iscsiSearchResults, setIscsiSearchResults] = useState([]);
  const [fcpSearchResults, setFcpSearchResults] = useState([]);


  const handleSearchIscsi = () => {
    if (!hostVoId) {
      toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
      return;
    }
    if (!address || !port) {
      toast.error('주소와 포트를 입력해주세요.');
      return;
    }
  
    const iscsiData = { address, port };
    importIscsiFromHost(
      { hostId: hostVoId, iscsiData },
      {
        onSuccess: (data) => {
          console.log('iSCSI 가져오기 성공:', data);
          setIscsiSearchResults(data); // 검색 결과 상태 업데이트
        },
        onError: (error) => {
          console.error('iSCSI 가져오기 실패:', error);
        },
      }
    );
  };

  const handleSearchFcp = () => {
    if (!hostVoId) {
      toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
      return;
    }  
    importFcpFromHost(
      { hostId: hostVoId },
      {
        onSuccess: (data) => {
          console.log('fcp 가져오기 성공:', data);
          setFcpSearchResults(data);
        },
        onError: (error) => {
          console.error('fcp 가져오기 실패:', error);
        },
      }
    );
  };

  const handleLoginIscsi = () => {
    if (!target) { // 체크박스를 선택해주세요
      toast.error('항목을 선택해주세요.');
      return;
    }
  
    const iscsiData = { target, address, port };
    loginIscsiFromHost(
      { hostId: hostVoId, iscsiData },
      {
        onSuccess: (data) => {
          console.log('iSCSI 로그인 성공:', data);
          setIscsiSearchResults(data); // 검색 결과 상태 업데이트
        },
        onError: (error) => {
          console.error('iSCSI 로그인 실패:', error);
        },
      }
    );
  };

  
  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
  
    let dataToSubmit;
  
    // 편집
    if (editMode) { 
      // 'edit' 액션에서는 formState 데이터만 제출
      dataToSubmit = {
        ...formState,
      };
    // 가져오기
    // }else if(importMode){  
    //   dataToSubmit = {
    //     ...formState,
    //   }
    // 생성
    } else {
      const selectedDataCenter = dataCenters.find((dc) => dc.id === dataCenterVoId);
      const selectedHost = hosts.find((h) => h.name === hostVoName);

      const logicalUnit =
        formState.storageType === 'iscsi' ? iscsis.find((iLun) => iLun.id === lunId)
          : formState.storageType === 'fcp'? fibres.find((fLun) => fLun.id === lunId)
          : null;

      const [storageAddress, storagePath] = nfsAddress.split(':');

      dataToSubmit = {
        ...formState,
        dataCenterVo: { id: selectedDataCenter.id, name: selectedDataCenter.name },
        hostVo: { id: selectedHost.id, name: selectedHost.name },
        logicalUnits: logicalUnit ? [logicalUnit.id] : [],
        ...(formState.storageType === 'nfs' && { storageAddress, storagePath }),
      };
    }
  
    console.log('Data to submit:', dataToSubmit);
  
    if (editMode) {
      editDomain(
        { domainId: formState.id, domainData: dataToSubmit },
        {
          onSuccess: () => {
            onClose();
            toast.success('도메인 편집 완료');
          },
        }
      );
    // } else if (importMode) {
    //   importDomain(dataToSubmit, {
    //     onSuccess: () => {
    //       toast.success('도메인 가져오기 완료');
    //       onClose();
    //     },
    //   });
    } else {
      addDomain(dataToSubmit, {
        onSuccess: () => {
          onClose();
          toast.success('도메인 생성 완료');
        },
      });
    }
  };

  
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"도메인"}
      submitTitle={editMode ? '편집' : '완료'}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-domain-administer-popup"> */}
        <div className="storage-domain-new-first">
          <div className="domain-new-left">

          <FormGroup label={Localization.kr.DATA_CENTER}>
            <select
              value={dataCenterVoId}
              onChange={(e) => setDataCenterVoId(e.target.value)}
              disabled={editMode}
            >
            {isDatacentersLoading ? (
              <p>{Localization.kr.DATA_CENTER}를 불러오는 중...</p>
            ) : dataCenters.length === 0 ? (
              <p>사용 가능한 {Localization.kr.DATA_CENTER}가 없습니다.</p>
            ) : datacenterId ? (
              <input 
                type="text" 
                value={dataCenter?.name || ''} 
                readOnly 
              />
            ) : (
              dataCenters.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name}
                </option>
              ))
            )}
            </select>
          </FormGroup>

          <FormGroup label="도메인 유형">
            <select
              value={formState.domainType}
              onChange={(e) => setFormState((prev) => ({ ...prev, domainType: e.target.value }))}
              disabled={editMode}
            >
              {domainTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="스토리지 유형">
            <select
              value={formState.storageType}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, storageType: e.target.value }))
              }
              disabled={editMode}
            >
              {storageTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label={Localization.kr.HOST}>
            <select
              value={hostVoName}
              onChange={(e) => setHostVoName(e.target.value)}
              disabled={editMode}
            >
              {isHostsLoading ? (
                <option key="loading">호스트를 불러오는 중...</option>
              ) : hosts.length === 0 ? (
                <option key="no-hosts">사용 가능한 호스트가 없습니다.</option>
              ) : (
                hosts.map((h) => (
                  <option key={h.name} value={h.name}>
                    {h.name} : {h.id}
                  </option>
                ))
              )}
            </select>
          </FormGroup>
        </div>

        <div className="domain-new-right">
          <FormGroup label={Localization.kr.NAME}>
            <input type="text"
              value={formState.name}
              autoFocus
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
            />
          </FormGroup>
          
          <FormGroup label={Localization.kr.DESCRIPTION}>
            <input
              type="text"
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            />
          </FormGroup>

          <FormGroup label={Localization.kr.COMMENT}>
            <input
              type="text"
              value={formState.comment}
              onChange={(e) => setFormState((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </FormGroup>
        </div>
      </div>
   
      {/* NFS 의 경우 */}
      {isNfs && (
        <div className="storage-popup-iSCSI">
          <div className="tab-content">
            <div className='domain-num-box'>
              <label htmlFor="NFSPath" className='label-font-body'>NFS 서버 경로</label>
              {editMode ? (
                <input
                  type="text"
                  placeholder="예: myserver.mydomain.com"
                  value={domain?.storageAddress}
                  disabled
                  style={{width: '310px', height: '22px'}}
                />
              ) : (
                <>
                  <div>
                    <input
                      type="text"
                      placeholder="예: myserver.mydomain.com:/my/local/path"
                      value={nfsAddress}
                      onChange={(e) => setNfsAddress(e.target.value)}
                      style={{width: '310px', height: '22px'}}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ISCSI 의 경우 */}
      {isIscsi && (        
        <div className="storage-popup-iSCSI">
          <div className="tab-content">
            {isIscsisLoading ? (
              <div className="label-font-body">로딩 중...</div>
            ) : isIscsisError ? (
              <div className="label-font-body">데이터를 불러오는 중 오류가 발생했습니다.</div>
            ) : (
              <>
                { editMode ? (
                  <Tables
                    columns={TableColumnsInfo.LUNS_TARGETS}
                    data={
                      domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
                        abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
                        status: logicalUnit.status,
                        id: logicalUnit.id,
                        size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "",
                        paths: logicalUnit.paths || 0,
                        vendorId: logicalUnit.vendorId || "",
                        productId: logicalUnit.productId || "",
                        serial: logicalUnit.serial || "",
                        target: logicalUnit.target || "",
                        address: logicalUnit.address || "",
                        port: logicalUnit.port || "",
                      })) || []
                    }
                    onRowClick={handleRowClick}
                    // shouldHighlight1stCol={true}
                  />
                // ): importMode ? (
                //   <>
                //     <label className='label_font_name'>대상 검색</label>
                //     {iscsiSearchResults?.length == 0 && (
                //       <>
                //     <FormGroup>
                //       <label className='label_font_name'>주소</label>
                //       <input
                //         type="text"
                //         value={address}
                //         onChange={(e) => setAddress(e.target.value)}
                //       />
                //     </FormGroup>
                //     <FormGroup>
                //       <label className='label_font_name'>포트</label>
                //       <input
                //         type="number"
                //         value={port}
                //         onChange={(e) => setPort(e.target.value)}
                //       />
                //     </FormGroup>
                //     <button className='search_button' onClick={handleSearchIscsi}>검색</button>
                //     </>
                //     )}
                //     {iscsiSearchResults?.length > 0 && (
                //       <>
                //         <button className='search_button' onClick={handleLoginIscsi}>로그인</button>

                //         <Tables
                //           columns={TableColumnsInfo.TARGETS_LUNS}
                //           data={iscsiSearchResults}
                //           onRowClick={handleRowClick}
                //           shouldHighlight1stCol={true}
                //         />
                //         <p style={{fontSize: '12px'}}>target: {target}, {address}, {port}</p>
                //       </>
                //     )}
                //     {/* <div className="disk_delete_box">
                //       <input
                //         type="checkbox"
                //         id="format"
                //         checked={useChap}
                //         onChange={(e) => setUseChap(e.target.checked)} // 체크 여부에 따라 true/false 설정
                //       />
                //       <label htmlFor="format">사용자 인증</label>
                //     </div>
                //     <FormGroup>
                //       <label className='label_font_name'>CHAP 사용자 이름</label>
                //       <input
                //         type="text"
                //         value={chapName}
                //         onChange={(e) => setChapName(e.target.value)}
                //         disabled={!useChap} // 사용자 인증이 체크되지 않으면 비활성화
                //       />
                //     </FormGroup>
                //     <FormGroup>
                //       <label className='label_font_name'>CHAP 암호</label>
                //       <input
                //         type="password"
                //         value={chapPassword}
                //         onChange={(e) => setChapPassword(e.target.value)}
                //         disabled={!useChap} // 사용자 인증이 체크되지 않으면 비활성화
                //       />
                //     </FormGroup> */}
                //   </>
                ): (
                  // create
                  <Tables
                    columns={TableColumnsInfo.LUNS_TARGETS}
                    data={iscsis}
                    onRowClick={handleRowClick}
                    shouldHighlight1stCol={true}
                  />    
                )}                
              </>
            )}
          </div>
          <div>
            <span>id: {lunId}</span>
          </div>
        </div>
      )}
      
      {isFibre && (
        <div className="storage-popup-iSCSI">
          <div className="tab-content">
            {isFibresLoading ? (
              <div className="label-font-body">로딩 중...</div>
            ) : isFibresError ? (
              <div className="label-font-body">데이터를 불러오는 중 오류가 발생했습니다.</div>
            ) : (
              <>
                {editMode ? (
                  <Tables
                    columns={TableColumnsInfo.FIBRE}
                    data={
                      domain?.hostStorageVo?.logicalUnits?.map((logicalUnit) => ({
                        abled: logicalUnit.storageDomainId === "" ? "OK" : "NO",
                        status: logicalUnit.status,
                        id: logicalUnit.id,
                        size: logicalUnit.size ? `${(logicalUnit.size / (1024 ** 3)).toFixed(2)} GB` : "N/A",
                        paths: logicalUnit.paths || 0,
                        vendorId: logicalUnit.vendorId || "N/A",
                        productId: logicalUnit.productId || "N/A",
                        serial: logicalUnit.serial || "N/A",
                        target: logicalUnit.target || "N/A",
                        address: logicalUnit.address || "N/A",
                        port: logicalUnit.port || "N/A",
                      })) || []
                    }
                    onRowClick={handleRowClick}
                    // shouldHighlight1stCol={true}
                  />
                // ): importMode ? (
                //   <>
                //     <button className='search_button' onClick={handleSearchFcp}>검색</button>

                //     {fcpSearchResults?.length > 0 && (
                //       <Tables
                //         columns={TableColumnsInfo.FIBRE_IMPORT}
                //         data={fcpSearchResults}
                //         onRowClick={handleRowClick}
                //         // shouldHighlight1stCol={true}
                //       />
                //     )}
                //   </>
                ): (
                  <Tables
                    columns={TableColumnsInfo.FIBRE}
                    data={fibres}
                    onRowClick={handleRowClick}
                    shouldHighlight1stCol={true}
                  />
                )} 
                <div>
                  <span>id: {lunId}</span>
                </div>
              </> 
            )}
          </div>
        </div>
      )}
      
      <div><hr/></div>

      <div className="tab-content">
        <div className="storage-specific-content">
          <FormGroup>
            <div className='domain-num-box'>
              <label className='label-font-body'>디스크 공간 부족 경고 표시(%)</label>
              <input
                type="number"
                value={formState.warning}
                className='input-number'
                onChange={(e) => setFormState((prev) => ({ ...prev, warning: e.target.value }))}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <div className='domain-num-box'>
              <label className='label-font-body'>심각히 부족한 디스크 공간의 동작 차단(GB)</label>
              <input
                type="number"
                value={formState.spaceBlocker}
                className='input-number'
                onChange={(e) => setFormState((prev) => ({ ...prev, spaceBlocker: e.target.value }))}
              />
            </div>
          </FormGroup>
        </div>
      </div>
    </BaseModal>
  );
};

export default DomainImportModal;
