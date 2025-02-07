import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { 
  useDiskById,
  useAddDisk,
  useEditDisk, 
  useAllActiveDataCenters,
  useAllActiveDomainFromDataCenter, 
  useAllDiskProfileFromDomain,
} from '../../../../api/RQHook';
import LabelInput from '../../../../utils/LabelInput';
import LabelInputNum from '../../../../utils/LabelInputNum';
import LabelSelectOptionsID from '../../../../utils/LabelSelectOptionsID';
import LabelSelectOptions from '../../../../utils/LabelSelectOptions';
import LabelCheckbox from '../../../../utils/LabelCheckbox';

const DiskModal = ({ isOpen, editMode = false, diskId, onClose }) => {
  const { mutate: addDisk } = useAddDisk();
  const { mutate: editDisk } = useEditDisk();

  const [activeTab, setActiveTab] = useState('img');
  const handleTabClick = (tab) => { setActiveTab(tab); };
  
  const [formState, setFormState] = useState({
    id: '',
    size: '',
    appendSize: 0,
    alias: '',
    description: '',
    wipeAfterDelete: false,
    sharable: false,
    backup: true,
    sparse: true, //할당정책: 씬
    // interface_: '', // vm 인터페이스 
    bootable: false, // vm 부팅가능
    logicalName:'',
    readOnly: false, // vm 읽기전용
    cancelActive: false, // vm 취소 활성화
  });
  const [dataCenterVoId, setDataCenterVoId] = useState('');
  const [domainVoId, setDomainVoId] = useState('');
  const [diskProfileVoId, setDiskProfileVoId] = useState('');

  const resetForm = () => {
    setFormState({
      id: '',
      size: '',
      appendSize: 0,
      alias: '',
      description: '',
      wipeAfterDelete: false,
      bootable: false,
      sharable: false,
      backup: true,
      sparse: true,
      readOnly: false,
      logicalName:'',
      passDiscard:true
    });
    setDataCenterVoId('');
    setDomainVoId('');
    setDiskProfileVoId('');
  };

  const sparseList = [
    { value: "true", label: "씬 프로비저닝" },
    { value: "false", label: "사전 할당" },
  ];

  // 디스크 데이터 가져오기
  const {
    data: disk,
    refetch: refetchDisk,
    isLoading: isDiskLoading
  } = useDiskById(diskId);

  // 전체 데이터센터 가져오기
  const {
    data: datacenters = [],
    refetch: refetchDatacenters,
    isLoading: isDatacentersLoading
  } = useAllActiveDataCenters((e) => ({...e,}));

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [],
    refetch: refetchDomains,
    isLoading: isDomainsLoading,
  } = useAllActiveDomainFromDataCenter(dataCenterVoId, (e) => ({...e,}));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const {
    data: diskProfiles = [],
    refetch: diskProfilesRefetch,
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfileFromDomain(domainVoId, (e) => ({...e,}));  

  
  useEffect(() => {
    if (!isOpen) {
      resetForm(); // 모달이 닫힐 때 상태를 초기화
    }
  }, [isOpen]);

  useEffect(() => {
    if (editMode && disk) {
      setFormState({
        id: disk?.id || '',
        size: (disk?.virtualSize / (1024 * 1024 * 1024)).toFixed(0),
        appendSize: 0,
        alias: disk?.alias || '',
        description: disk?.description || '',
        wipeAfterDelete: disk?.wipeAfterDelete || false,
        sharable: disk?.sharable || false,
        backup: disk?.backup || false,
        sparse: disk?.sparse || false,
      });
      setDataCenterVoId(disk?.dataCenterVo?.id || '');
      setDomainVoId(disk?.storageDomainVo?.id || '');
      setDiskProfileVoId(disk?.diskProfileVo?.id || '');
    } else if (!editMode && !isDatacentersLoading) {
      resetForm();
    }
  }, [editMode, disk]);

  useEffect(() => {
    if (!editMode && datacenters.length > 0) {
      setDataCenterVoId(datacenters[0].id);
    }
  }, [isOpen, datacenters, editMode]);

  useEffect(() => {
    if (!editMode && domains.length > 0) {
      setDomainVoId(domains[0].id);
    }
  }, [domains, editMode]);

  useEffect(() => {
    if (!editMode && diskProfiles.length > 0) {
      setDiskProfileVoId(diskProfiles[0].id);
    }
  }, [diskProfiles, editMode]);


  const validateForm = () => {
    if (!formState.alias) return '별칭을 입력해주세요.';
    if (!formState.size) return '크기를 입력해주세요.';
    if (!dataCenterVoId) return '데이터 센터를 선택해주세요.';
    if (!domainVoId) return '스토리지 도메인을 선택해주세요.';
    if (!diskProfileVoId) return '디스크 프로파일을 선택해주세요.';
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    
    const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환
    const appendSizeToBytes = parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환 (기본값 0)

    const selectedDataCenter = datacenters.find((dc) => dc?.id === dataCenterVoId);
    const selectedDomain = domains.find((dm) => dm?.id === domainVoId);
    const selectedDiskProfile = diskProfiles.find((dp) => dp?.id === diskProfileVoId);


    // 데이터 객체 생성
    const diskDataToSubmit = {
      dataCenterVo: { id: selectedDataCenter?.id, name: selectedDataCenter?.name },
      storageDomainVo: { id: selectedDomain?.id, name: selectedDomain?.name },
      diskProfileVo: { id: selectedDiskProfile?.id, name: selectedDiskProfile?.name },
      ...formState,
      size: sizeToBytes
    };

    console.log("Form Data: ", diskDataToSubmit); // 데이터를 확인하기 위한 로그
    
    if (editMode) {
      diskDataToSubmit.appendSize = appendSizeToBytes;   
      editDisk(
        { diskId: formState.id, diskData: diskDataToSubmit}, 
        {
          onSuccess: () => {
            onClose();  // 성공 시 모달 닫기
            toast.success("디스크 편집 완료")
          },
        });
    } else {
      addDisk(diskDataToSubmit, {
        onSuccess: () => {
          onClose();
          toast.success("디스크 생성 완료")
        },
      });
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={editMode ? '디스크 편집' : '새로 만들기'}
      className="Modal"
      overlayClassName="Overlay newRolePopupOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-disk-new-popup">
        <div className="popup-header">
          <h1>{editMode ? '디스크 편집' : '새 디스크 생성'}</h1>
          <button onClick={onClose}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
        </div>

        <div className="disk-new-nav">
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
            직접 LUN
          </div>
        </div>

        {/*이미지*/}
        {activeTab === 'img' && (
          <div className="disk-new-img">
            <div className="disk-new-img-left">
  
              <LabelInputNum
                className="img-input-box"
                label="크기(GB)"
                value={formState.size}
                autoFocus={true}
                onChange={(e) => setFormState((prev) => ({ ...prev, size: e.target.value }))}
                disabled={editMode}
              />

              {editMode && (
                <LabelInputNum
                  className="img-input-box"
                  label="추가크기(GB)"
                  value={formState.appendSize}
                  onChange={(e) => setFormState((prev) => ({ ...prev, appendSize: e.target.value }))}
                />
              )} 

              <LabelInput
                className="img-input-box"
                label="별칭"
                value={formState.alias}
                onChange={(e) => setFormState((prev) => ({ ...prev, alias: e.target.value }))}
              />
              <LabelInput
                className="img-input-box"
                label="설명"
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
              />
              
              <LabelSelectOptionsID
                className="img-input-box"
                label="데이터 센터"
                value={dataCenterVoId}
                onChange={(e) => setDataCenterVoId(e.target.value)}
                disabled={editMode}
                loading={isDatacentersLoading}
                options={datacenters}
              />
              <LabelSelectOptionsID
                className="img-input-box"
                label="스토리지 도메인"
                value={domainVoId}
                onChange={(e) => setDomainVoId(e.target.value)}
                disabled={editMode}
                loading={isDomainsLoading}
                options={domains}
              />

              <LabelSelectOptions
                className="img-input-box"
                label="할당 정책"
                value={formState.sparse ? "true" : "false"}
                onChange={(e) => setFormState((prev) => ({ ...prev, sparse: e.target.value === "true" }))}
                disabled={editMode}
                options={sparseList}
              />
              <LabelSelectOptionsID
                className="img-input-box"
                label="디스크 프로파일"
                value={diskProfileVoId}
                onChange={(e) => setDiskProfileVoId(e.target.value)}
                loading={isDiskProfilesLoading}
                options={diskProfiles}
              />
            </div>

            <div className="disk-new-img-right">
              <LabelCheckbox
                label="삭제 후 초기화"
                id="wipeAfterDelete"
                checked={formState.wipeAfterDelete}
                onChange={(e) => setFormState((prev) => ({ ...prev, wipeAfterDelete: e.target.checked }))}
              />
              <LabelCheckbox
                label="공유 가능"
                id="sharable"
                checked={formState.sharable}
                onChange={(e) => setFormState((prev) => ({ ...prev, sharable: e.target.checked }))}
                disabled={editMode}
              />
              <LabelCheckbox
                label="증분 백업 사용"
                id="backup"
                checked={formState.backup}
                onChange={(e) => setFormState((prev) => ({ ...prev, backup: e.target.checked }))}
              />
            </div>
          </div>
        )} 

        {/* 직접LUN */}
        { activeTab === 'directlun' && (
          <div id="storage_directlun_outer">
            <div className="disk-new-img">
              <div className="disk-new-img-left">

                <div className="img-input-box">
                  <label>별칭</label>
                  <input type="text" />
                </div>
                <div className="img-input-box">
                  <label>설명</label>
                  <input type="text" />
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">데이터 센터</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">호스트</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">스토리지 타입</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
              </div>
              <div className="disk-new-img-right">
                <div>
                  <input type="checkbox" className="shareable" />
                  <label htmlFor="shareable">공유 가능</label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="edit-footer">
          <button onClick={handleFormSubmit}>{editMode ? '편집' : '생성'}</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DiskModal;
