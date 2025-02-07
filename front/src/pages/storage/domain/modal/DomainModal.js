import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
import LabelSelectOptionsID from '../../../../utils/LabelSelectOptionsID';
import LabelSelectOptions from '../../../../utils/LabelSelectOptions';
import LabelInput from '../../../../utils/LabelInput';
import DomainNfs from './DomainCreate/DomainNfs';
import DomainIscsi from './DomainCreate/DomainIscsi';
import DomainFibre from './DomainCreate/DomainFibre';
import LabelInputNum from '../../../../utils/LabelInputNum';

const DomainModal = ({ isOpen, editMode=false, domainId, datacenterId, onClose }) => {
  const { mutate: addDomain } = useAddDomain();
  const { mutate: editDomain } = useEditDomain();
  const { mutate: importDomain } = useImportDomain(); // 가져오기

  const { mutate: loginIscsiFromHost } = useLoginIscsiFromHost();  // 가져오기 iscsi 로그인
  const { mutate: importIscsiFromHost } = useImportIscsiFromHost(); // 가져오기 iscsi
  const { mutate: importFcpFromHost } = useImportFcpFromHost();   // 가져오기 fibre

  // 일반정보
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

  // import = 가져오기
  // nfs 는 같음, iscsi 주소, 포트, 사용자 인증 이름, 암호 해서 검색
  const [formImportState, setFormImportState] = useState({
    target: '',
    address: '',
    port: 3260,
    chapName: '',
    chapPassword: '',
    useChap: false,
  });

  const [dataCenterVoId, setDataCenterVoId] = useState('');  
  const [hostVoName, setHostVoName] = useState('');
  const [hostVoId, setHostVoId] = useState('');
  const [storageTypes, setStorageTypes] = useState([]);

  const [nfsAddress, setNfsAddress] = useState('');  // nfs
  const [lunId, setLunId] = useState(''); // iscsi, fibre 생성시 사용
  
  const [iscsiSearchResults, setIscsiSearchResults] = useState([]);
  const [fcpSearchResults, setFcpSearchResults] = useState([]);

  // 초기화
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
    setFormImportState({
      target: '',
      address: '',
      port: 3260,
      chapName: '',
      chapPassword: '',
      useChap: false,
    });
    setIscsiSearchResults([]); // iSCSI 검색 결과 초기화
    setFcpSearchResults([]);   // FCP 검색 결과 초기화
    setNfsAddress('');
    setLunId('');
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
  } = useHostsFromDataCenter(
    dataCenterVoId ? dataCenterVoId : null, (e) => ({...e,}));

  // iscsi 목록 가져오기
  const {
    data: iscsis = [],
    refetch: refetchIscsis,
    error: isIscsisError,
    isLoading: isIscsisLoading,
  } = useIscsiFromHost(hostVoId, ((e) => {
    const unit = e?.logicalUnits[0];
    return {
      ...e,
      abled: unit?.storageDomainId === "" ? 'OK' : 'NO',
      target: unit?.target,
      address: unit?.address,
      port: unit?.port,
      status: unit?.status,
      size: (unit?.size ? unit?.size / (1024 ** 3): unit?.size),
      paths: unit?.paths,   
      productId: unit?.productId,   
      vendorId: unit?.vendorId,
      serial: unit?.serial,
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
      status: unit?.status,
      size: (unit?.size ? unit.size / (1024 ** 3): unit?.size),
      paths: unit?.paths,   
      productId: unit?.productId,   
      vendorId: unit?.vendorId,   
      serial: unit?.serial
    };
  }));

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

  const isNfs = formState.storageType === 'nfs' || domain?.storageType === 'nfs';
  const isIscsi = formState.storageType === 'iscsi' || domain?.storageType === 'iscsi';
  const isFibre = formState.storageType === 'fcp' || domain?.storageType === 'fcp';

  // 편집은 단순 이름, 설명 변경정도
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
    }
  }, [editMode, domain]);  
  
  useEffect(() => {
    if (!isOpen) {
      resetForm(); // 모달이 닫힐 때 상태를 초기화
    }
  }, [isOpen]);
  
  useEffect(() => {
    if(datacenterId){
      setDataCenterVoId(datacenterId);
    } else if (!editMode && dataCenters && dataCenters.length > 0) {
      setDataCenterVoId(dataCenters[0].id);
    }
  }, [dataCenters, datacenterId, editMode]);
  
  useEffect(() => {
    if (!editMode && hosts && hosts.length > 0) {
      setHostVoId(hosts[0].id);
      setHostVoName(hosts[0].name);
    }
  }, [hosts, editMode]);  

  useEffect(() => {
    if (formState.storageType === 'iscsi' && hostVoId) {
      refetchIscsis();
    }
  }, [hostVoId, formState.storageType, refetchIscsis]);
  

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
  
    setFormImportState({
      target: '',
      address: '',
      port: 3260,
      chapName: '',
      chapPassword: '',
      useChap: false,
    });
  }, [formState.storageType]);

  // const handleRowClick = (row) => {
  //   console.log('선택한 행 데이터:', row);
  //   setLunId(row.id); // 선택된 LUN ID 설정
  //   setFormImportState((prev) => ({
  //     ...prev,
  //     target: row.target || '',
  //     address: row.address || '',
  //     port: row.port || 3260, // 기본값 유지
  //   }));
  // };
  

  const validateForm = () => {
    if (!formState.name) return '이름을 입력해주세요.';
    if (!dataCenterVoId) return '데이터 센터를 선택해주세요.';
    if (!hostVoName) return '호스트를 선택해주세요.';
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="도메인 관리"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-domain-administer-popup modal">
        <div className="popup-header">
          <h1>{
            // importMode ? "도메인 가져오기":
            editMode ? "도메인 편집"
            : "새로운 도메인 생성"
          }
          </h1>
          <button onClick={onClose}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
        </div>

        <div className="storage-domain-new-first">
          <div >

            <LabelSelectOptionsID 
              className="domain-new-select center"
              label="데이터센터"
              value={dataCenterVoId}
              onChange={(e) => setDataCenterVoId(e.target.value)}
              disabled={editMode}
              loading={isDatacentersLoading}
              options={dataCenters}
            />
            <LabelSelectOptions
              className="domain-new-select center"
              label="도메인 유형"
              value={formState.domainType}
              onChange={(e) => setFormState((prev) => ({ ...prev, domainType: e.target.value }))}
              disabled={editMode}
              options={domainTypes}
            />
            <LabelSelectOptions
              className="domain-new-select center"
              label="스토리지 유형"
              value={formState.storageType}
              onChange={(e) => setFormState((prev) => ({ ...prev, storageType: e.target.value }))}
              disabled={editMode}
              options={storageTypes}
            />

            <div className="domain-new-select center">
              <label>호스트</label>
              <select
                label="호스트"
                value={hostVoName}
                onChange={(e) => setHostVoName(e.target.value)}
                disabled={editMode}
              >
                {isHostsLoading ? (
                  <option key="loading">호스트를 불러오는 중...</option>
                ) : (
                  hosts.map((h) => (
                    <option key={h.name} value={h.name}>
                      {h.name} : {h.id}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="domain-new-right">
            <LabelInput
              className="domain-new-select center"
              label="이름"
              id='name'
              autoFocus={true}
              value={formState.name}
              onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
            />
            <LabelInput
              className="domain-new-select center"
              label="설명"
              id='description'
              value={formState.description}
              onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            />
            <LabelInput
              className="domain-new-select center"
              label="코멘트"
              id='comment'
              value={formState.comment}
              onChange={(e) => setFormState((prev) => ({ ...prev, comment: e.target.value }))}
            />
          </div>
        </div>
   
      {/* NFS 의 경우 */}
      {isNfs && (
        <DomainNfs
          editMode={editMode}
          // importMode={importMode}
          nfsAddress={nfsAddress}
          setNfsAddres={setNfsAddress}
          domain={domain}
        />
      )}
      
      {/* ISCSI 의 경우 */}
      {isIscsi && (
        <DomainIscsi
          editMode={editMode}
          domain={domain}
          iscsis={iscsis}
          iscsiSearchResults={iscsiSearchResults}
          setIscsiSearchResults={setIscsiSearchResults}
          lunId={lunId}
          setLunId={setLunId}
          hostVoId={hostVoId}
          hostVoName={hostVoName}
          setHostVoName={setHostVoName}
          isIscsisLoading={isIscsisLoading}
          importIscsiFromHost={importIscsiFromHost}
          loginIscsiFromHost={loginIscsiFromHost}
          formImportState={formImportState}  // ✅ formImportState 전달
          setFormImportState={setFormImportState} // ✅ 상태 업데이트 함수 전달
          refetchIscsis={refetchIscsis}
        />
      )}

      {/* Firbre 의 경우 */}
      {isFibre && (
        <DomainFibre
          editMode={editMode}
          domain={domain}
          fibres={fibres}
          fcpSearchResults={fcpSearchResults}
          setFcpSearchResults={setFcpSearchResults}
          lunId={lunId}
          setLunId={setLunId}
          hostVoId={hostVoId}
          importFcpFromHost={importFcpFromHost}
          // handleRowClick={handleRowClick}
          formImportState={formImportState}  // ✅ formImportState 전달
          setFormImportState={setFormImportState} // ✅ 상태 업데이트 함수 전달
        />
      )}
    
      <div><hr/></div>

      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum
            className='domain-num-box center'
            label="디스크 공간 부족 경고 표시(%)"
            id='warning'
            value={formState.warning}
            onChange={(e) => setFormState((prev) => ({ ...prev, warning: e.target.value }))}
          />
          <LabelInputNum
            className='domain-num-box center'
            label="심각히 부족한 디스크 공간의 동작 차단(GB)"
            id='spaceBlocker'
            value={formState.spaceBlocker}
            onChange={(e) => setFormState((prev) => ({ ...prev, spaceBlocker: e.target.value }))}
          />
        </div>
      </div>

      <div className="edit-footer">
        <button style={{ display: 'none' }}></button>
        <button onClick={handleFormSubmit}>{editMode ? '편집' : '완료'}</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
    </Modal>
  );
};

export default DomainModal;
