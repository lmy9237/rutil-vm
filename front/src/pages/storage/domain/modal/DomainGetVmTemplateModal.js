import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import '../css/MDomain.css';
import { useDataCenter } from '../../../../api/RQHook';
import { CheckKoreanName, CheckName } from '../../../../utils/CheckName';
import { xButton } from '../../../../utils/Icon';

const initialFormState = {
  id: '',
  name: '',
  comment: '',
  description: '',
  storageType: false,
  version: '4.7',
  quotaMode: 'DISABLED',
};

const DomainGetVmTemplateModal = ({ isOpen, type = 'vm', dcId, onClose }) => {
  const isVmMode = type === 'vm'; // true면 "가상머신", false면 "템플릿"
  const [formState, setFormState] = useState(initialFormState);
  const { data: datacenter } = useDataCenter(dcId);

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (datacenter) {
      setFormState({
        id: datacenter.id,
        name: datacenter.name,
        comment: datacenter.comment,
        description: datacenter.description,
        storageType: String(datacenter.storageType),
        version: datacenter.version,
        quotaMode: datacenter.quotaMode,
      });
    }
  }, [isOpen, datacenter]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!CheckKoreanName(formState.name) || !CheckName(formState.name)) return '이름이 유효하지 않습니다.';
    if (!CheckKoreanName(formState.description)) return '영어만 입력가능.';
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    onClose();
    toast.success(`${isVmMode ? '가상머신' : '템플릿'} 가져오기 완료`);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      contentLabel={isVmMode ? '가상머신' : '템플릿'} 
      className="Modal" 
      overlayClassName="Overlay" 
      shouldCloseOnOverlayClick={false}
    >
      <div className="get-vm-template modal">
        <div className="popup-header">
          <h1>{isVmMode ? '가상머신 가져오기' : '템플릿 가져오기'}</h1>
          <button onClick={onClose}>{xButton()}</button>
        </div>

        <div className="datacenter-new-content modal-content">
          {/* 입력 폼 (현재 비활성화 상태) */}
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>가져오기</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DomainGetVmTemplateModal;
