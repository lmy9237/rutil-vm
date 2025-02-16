import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const NewBondingModal = ({ isOpen, onClose, mode = 'edit' }) => {
  // 제목을 모드에 따라 설정
  const modalTitle = mode === 'create' ? '새 본딩 제작' : '본딩 편집';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="추가"
      className="Modal"
      overlayClassName="Overlay newRolePopupOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="network-bonding-modal modal">
        <div className="popup-header">
          <h1>{modalTitle}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className='bonding-content modal-content'>
            <div className="select-box">
                <label htmlFor="ip_address">본딩이름</label>
                <input type='text'/>
            </div>
            <div className="select-box">
                <label htmlFor="ip_address">본딩모드</label>
                <select id="ip_address" disabled>
                    <option value="#">#</option>
                </select>
            </div>
            <div className="select-box">
                <label htmlFor="ip_address">사용자 정의 모드</label>
                <input type='text'/>
            </div>
        </div>



        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default NewBondingModal;
