import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BaseModal from "../BaseModal";
import LabelInput from '../../label/LabelInput';
import LabelInputNum from '../../label/LabelInputNum';
import LabelSelectOptionsID from '../../label/LabelSelectOptionsID';
import LabelSelectOptions from '../../label/LabelSelectOptions';
import LabelCheckbox from '../../label/LabelCheckbox';
import { 
  useDiskById,
  useAddDisk,
  useEditDisk, 
  useAllActiveDataCenters,
  useAllActiveDomainFromDataCenter, 
  useAllDiskProfileFromDomain,
} from '../../../api/RQHook';
import { checkKoreanName } from '../../../util';

const initialFormState = {
  id: '',
  size: '',
  appendSize: 0,
  alias: '',
  description: '',
  wipeAfterDelete: false,
  sharable: false,
  backup: true,
  sparse: true, //할당정책: 씬
  bootable: false, // vm 부팅가능
  logicalName:'',
  readOnly: false, // vm 읽기전용
  cancelActive: false, // vm 취소 활성화
};

const sparseList = [
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

const DiskModal = ({ isOpen, editMode = false, diskId, onClose }) => {
  const dLabel = editMode ? '편집' : '생성';
  const { mutate: addDisk } = useAddDisk();
  const { mutate: editDisk } = useEditDisk();

  const [activeTab, setActiveTab] = useState('img');
  const handleTabClick = (tab) => { setActiveTab(tab); };
  
  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVoId, setDataCenterVoId] = useState('');
  const [domainVoId, setDomainVoId] = useState('');
  const [diskProfileVoId, setDiskProfileVoId] = useState('');
 
  const { data: disk } = useDiskById(diskId);
  const { data: datacenters = [], isLoading: isDatacentersLoading } = useAllActiveDataCenters((e) => ({...e,}));
  const { data: domains = [], isLoading: isDomainsLoading } = useAllActiveDomainFromDataCenter(dataCenterVoId, (e) => ({...e,}));
  const { data: diskProfiles = [], isLoading: isDiskProfilesLoading } = useAllDiskProfileFromDomain(domainVoId, (e) => ({...e,}));  
  

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
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
    }
  }, [isOpen, editMode, disk]);

  useEffect(() => {
    if (!editMode && datacenters && datacenters.length > 0) {
      setDataCenterVoId(datacenters[0].id);
    }
  }, [datacenters, editMode]);

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

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };
  

  const validateForm = () => {
    if (!checkKoreanName(formState.alias)) return '별칭은 영어만 입력가능합니다.';
    if (!formState.alias) return '별칭를 입력해주세요.';
    if (!formState.size) return '크기를 입력해주세요.';
    if (!dataCenterVoId) return '데이터 센터를 선택해주세요.';
    if (!domainVoId) return '스토리지 도메인을 선택해주세요.';
    if (!diskProfileVoId) return '디스크 프로파일을 선택해주세요.';
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);
    
    const selectedDataCenter = datacenters.find((dc) => dc?.id === dataCenterVoId);
    const selectedDomain = domains.find((dm) => dm?.id === domainVoId);
    const selectedDiskProfile = diskProfiles.find((dp) => dp?.id === diskProfileVoId);

    const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환
    const appendSizeToBytes = parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환 (기본값 0)

    const dataToSubmit = {
      ...formState,
      size: sizeToBytes,
      appendSize: appendSizeToBytes,
      dataCenterVo: { id: selectedDataCenter?.id, name: selectedDataCenter?.name },
      storageDomainVo: { id: selectedDomain?.id, name: selectedDomain?.name },
      diskProfileVo: { id: selectedDiskProfile?.id, name: selectedDiskProfile?.name },
    };
    
    const onSuccess = () => {
      onClose();
      toast.success(`디스크 ${dLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${dLabel} disk: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그
    
    editMode 
      ? editDisk({ diskId: formState.id, diskData: dataToSubmit}, { onSuccess, onError })
      : addDisk(dataToSubmit, { onSuccess, onError });
  };
  
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"디스크"}
      submitTitle={dLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px", height: "570px" }} 
    >
      <div className="popup-content-outer">
        <div className="disk-new-nav">
          <div id="storage_img_btn" onClick={() => handleTabClick('img')} className={activeTab === 'img' ? 'active' : ''} >
            이미지
          </div>
          {/* <div id="storage_directlun_btn" onClick={() => handleTabClick('directlun')} className={activeTab === 'directlun' ? 'active' : ''} >
            직접 LUN
          </div> */}
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
              <LabelCheckbox label="삭제 후 초기화" id="wipeAfterDelete" checked={formState.wipeAfterDelete} onChange={handleInputChangeCheck('wipeAfterDelete')} />
              <LabelCheckbox label="공유 가능" id="sharable" checked={formState.sharable} onChange={handleInputChangeCheck('sharable')} disabled={editMode} />
              <LabelCheckbox label="증분 백업 사용" id="backup" checked={formState.backup} onChange={handleInputChangeCheck('backup')}/>
            </div>
          </div>
        )} 

        {/* 직접LUN */}
        {/* {activeTab === 'directlun' && (
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
        )} */}
      </div>
    </BaseModal>
  );
};

export default DiskModal;
