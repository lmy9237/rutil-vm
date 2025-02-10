import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { 
  useAllActiveDomainFromDataCenter, 
  useAllDiskProfileFromDomain,
  useAddDiskFromVM,
  useEditDiskFromVM,
  useEditDisk,
} from '../../../../api/RQHook';
import toast from 'react-hot-toast';
import LabelInput from '../../../../utils/LabelInput';
import LabelInputNum from '../../../../utils/LabelInputNum';
import LabelSelectOptionsID from '../../../../utils/LabelSelectOptionsID';
import LabelSelectOptions from '../../../../utils/LabelSelectOptions';
import LabelCheckbox from '../../../../utils/LabelCheckbox';
import { xButton } from '../../../../utils/Icon';

const initialFormState = {
  id: '',
  size: '',
  appendSize: 0,
  alias: '',
  description: '',
  interface_: 'VIRTIO_SCSI', // 인터페이스 
  sparse: true, //할당정책: 씬
  active: true, // 디스크 활성화
  wipeAfterDelete: false, // 삭제 후 초기화
  bootable: false, // 부팅가능
  sharable: false, // 공유가능
  readOnly: false, // 읽기전용
  cancelActive: false, // 취소 활성화
  backup: true, // 증분 백업사용
};

// eslint-disable-next-line react-hooks/exhaustive-deps
const interfaceList = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO", label: "VirtIO" },
  { value: "SATA", label: "SATA" },
];

const sparseList = [
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

// type은 vm이면 가상머신 생성할때 디스크 생성하는 창, disk면 가상머신 디스크 목록에서 생성하는
const VmDiskModal = ({ isOpen, editMode = false, vm, dataCenterId, diskAttachment, type="disk", onCreateDisk, onClose }) => {
  const dLabel = editMode ? '편집' : '생성';
  const { mutate: addDiskVm } = useAddDiskFromVM();
  const { mutate: editDiskVm } = useEditDiskFromVM();
  const { mutate: editDisk } = useEditDisk();

  const [activeTab, setActiveTab] = useState('img');
  const handleTabClick = (tab) => { setActiveTab(tab); };

  const [formState, setFormState] = useState(initialFormState);
  const [domainVoId, setDomainVoId] = useState('');
  const [diskProfileVoId, setDiskProfileVoId] = useState('');


  // 디스크 데이터 가져오기
  // const {
  //   data: diskAtt,
  //   refetch: refetchDisk,
  //   isLoading: isDiskLoading
  // } = useDiskAttachmentFromVm(vm?.id, diskAttachment?.id);

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [],
    refetch: refetchDomains,
    isLoading: isDomainsLoading,
  } = useAllActiveDomainFromDataCenter(dataCenterId, (e) => ({...e,}));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const {
    data: diskProfiles = [],
    refetch: diskProfilesRefetch,
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfileFromDomain(domainVoId, (e) => ({...e,}));  


  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (editMode && diskAttachment) {
      setFormState({
        id: diskAttachment?.id || '',
        size: (diskAttachment?.diskImageVo?.virtualSize / (1024 * 1024 * 1024)).toFixed(0),
        appendSize: 0,
        alias: diskAttachment?.diskImageVo?.alias || '',
        description: diskAttachment?.diskImageVo?.description || '',
        interface_: diskAttachment?.interface_ || 'VIRTIO_SCSI',
        sparse: diskAttachment?.sparse || false,
        active: diskAttachment?.active || false,
        wipeAfterDelete: diskAttachment?.diskImageVo?.wipeAfterDelete || false,
        bootable: diskAttachment?.bootable || false,
        sharable: diskAttachment?.diskImageVo?.sharable || false,
        readOnly: diskAttachment?.readOnly || false,
        cancelActive: diskAttachment?.cancelActive || false,
        backup: diskAttachment?.diskImageVo?.backup || false,
      });
      setDomainVoId(diskAttachment?.diskImageVo?.storageDomainVo?.id || '');
      setDiskProfileVoId(diskAttachment?.diskImageVo?.diskProfileVo?.id || '');
    }
  }, [isOpen, editMode, diskAttachment]);

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
    
  useEffect(() => {
    if (!editMode && interfaceList.length > 0 && !formState.interface_) {
      setFormState((prev) => ({ ...prev, interface_: interfaceList[0].value }));
    }
  }, [interfaceList, editMode, formState.interface_]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };
  

  const validateForm = () => {
    if (!formState.alias) return '별칭을 입력해주세요.';
    if (!formState.size) return '크기를 입력해주세요.';
    if (!domainVoId) return '스토리지 도메인을 선택해주세요.';
    if (!diskProfileVoId) return '디스크 프로파일을 선택해주세요.';
    return null;
  };

    // vm disk에서 생성 (가상머신 생성x)
  const handleOkClick = () => {
    if (!formState.alias || !formState.size || !domainVoId || !diskProfileVoId) {
      toast.error('필수 값을 입력하세요.');
      return;
    }

    const newDisk = {
      alias: formState.alias,
      size: formState.size,
      interface_: formState.interface_,
      sparse: formState.sparse,
      bootable: formState.bootable,
      readOnly: formState.readOnly,
      storageDomainVo: { id: domainVoId },
      diskProfileVo: { id: diskProfileVoId },
      isCreated: true, // 🚀 생성된 디스크는 isCreated: true
    };

    onCreateDisk(newDisk);
    onClose();
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    
    const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환
    const appendSizeToBytes = parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환 (기본값 0)

    const selectedDomain = domains.find((dm) => dm.id === domainVoId);
    const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVoId);

    // 전송 객체
    const dataToSubmit = {
      id: diskAttachment?.id,
      bootable: formState.bootable,
      readOnly: formState.readOnly,
      passDiscard: formState.passDiscard,
      interface_: formState.interface_,
      diskImageVo: { 
        alias: formState.alias,
        size: sizeToBytes,
        appendSize: appendSizeToBytes,
        description: formState.description,
        wipeAfterDelete:formState.wipeAfterDelete,
        backup:formState.backup,
        sparse:Boolean(formState.sparse),
        storageDomainVo: { id: selectedDomain?.id, name: selectedDomain?.name },
        diskProfileVo: { id: selectedDiskProfile?.id, name: selectedDiskProfile?.name },
      }
    }
    console.log("Form Data: ", dataToSubmit); // 데이터 확인 로그

    if (editMode) {
      editDiskVm(
        { vmId: vm?.id, diskAttachmentId: diskAttachment?.id, diskAttachment: dataToSubmit }, {
        onSuccess: () => {
          toast.success("가상머신 디스크 편집 완료");
          onClose();
        },
        onError: (error) => {
          toast.error('Error editing cluster:', error);
        }
      });
    } else {
      addDiskVm(
        { vmId: vm?.id, diskData: dataToSubmit },
        {
        onSuccess: () => {
          toast.success("가상머신 디스크 생성 완료");
          onClose(); // 성공 시 모달 닫기
        },
        onError: (error) => {
          toast.error('오류 발생:', error);
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={dLabel} className="Modal" overlayClassName="Overlay newRolePopupOverlay" shouldCloseOnOverlayClick={false} >
      <div className="storage-disk-new-popup modal">
        <div className="popup-header">
          <h1>디스크 {dLabel}</h1>
          <button onClick={onClose}> { xButton() } </button>
        </div>

        <div className="disk-new-nav">
          <div id="storage_img_btn" onClick={() => handleTabClick('img')} className={activeTab === 'img' ? 'active' : ''} >
            이미지
          </div>
          <div id="storage_directlun_btn" onClick={() => handleTabClick('directlun')} className={activeTab === 'directlun' ? 'active' : ''} >
            직접 LUN
          </div>
        </div>

        {/*이미지*/}
        {activeTab === 'img' && (
          <div className="disk-new-img">
            <div className="disk-new-img-left">
            <LabelInputNum className="img-input-box" label="크기(GB)" value={formState.size} onChange={handleInputChange('size')} autoFocus={true} disabled={editMode} />
              {editMode && (
                <LabelInputNum className="img-input-box" label="추가크기(GB)" value={formState.appendSize} onChange={handleInputChange('appendSize')} />
              )} 
              <LabelInput className="img-input-box" label="별칭" value={formState.alias} onChange={handleInputChange('alias')} />
              <LabelInput className="img-input-box" label="설명" value={formState.description} onChange={handleInputChange('description')} />
              
              <LabelSelectOptions
                className="img-input-box"
                label="인터페이스"
                value={formState.interface_}
                onChange={(e) =>setFormState((prev) => ({ ...prev, interface_: e.target.value }))}
                disabled={editMode}
                options={interfaceList}
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
              <span>{formState.sparse}</span>
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
            {!editMode && (
              <LabelCheckbox label="디스크 활성화" id="active" checked={formState.active} onChange={handleInputChangeCheck('active')} />
            )}
              <LabelCheckbox label="삭제 후 초기화" id="wipeAfterDelete" checked={formState.wipeAfterDelete} onChange={handleInputChangeCheck('wipeAfterDelete')} />
              <LabelCheckbox label="부팅 가능" id="bootable" checked={formState.bootable} onChange={handleInputChangeCheck('bootable')} disabled={editMode && !formState.bootable}  />
              <LabelCheckbox label="공유 가능" id="sharable" checked={formState.sharable} onChange={handleInputChangeCheck('sharable')} disabled={editMode} />
              <LabelCheckbox label="읽기 전용" id="readOnly" checked={formState.readOnly} onChange={handleInputChangeCheck('readOnly')} disabled={editMode} />
              <LabelCheckbox label="취소 활성화" id="cancelActive" checked={formState.cancelActive} onChange={handleInputChangeCheck('cancelActive')} disabled={editMode} />
              <LabelCheckbox label="증분 백업 사용" id="backup" checked={formState.backup} onChange={handleInputChangeCheck('backup')}/>
            </div>
          </div>
        )} 
        {/* 직접LUN */}
        {activeTab === 'directlun' && (
          <div id="storage-directlun-outer">
            <div id="storage-lun-first">
              <div className="disk-new-img-left">
                <div className="img-input-box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img-input-box">
                  <span>설명</span>
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
          <button style={{ display: 'none' }}></button>
          <button onClick={type==="disk" ? handleFormSubmit : handleOkClick}>{editMode ? '편집' : '생성'}</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmDiskModal;
