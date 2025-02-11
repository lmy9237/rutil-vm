import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Tables from '../../table/Tables';
import './MNetwork.css';

const NetworkImportModal = ({ isOpen, onClose, onSubmit }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="가져오기"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="network-bring-popup modal">
        <div className="popup-header">
          <h1>네트워크 가져오기</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="network-form-group center">
          <label htmlFor="cluster" style={{ fontSize: '0.33rem', fontWeight: '600' }}>네트워크 공급자</label>
          <select id="cluster">
            <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
          </select>
        </div>

        <div className="network-bring-table-outer">
          <span className="font-bold">공급자 네트워크</span>
          <div>
            <Tables
              columns={[
                { header: '', accessor: 'checkbox' },
                { header: '이름', accessor: 'name' },
                { header: '공급자의 네트워크 ID', accessor: 'networkId' },
              ]}
              data={[
                { checkbox: <input type="checkbox" id="provider_network_1" defaultChecked />, name: '디스크 활성화', networkId: '디스크 활성화' },
              ]}
            />
          </div>
        </div>

        <div className="network-bring-table-outer">
          <span>가져올 네트워크</span>
          <div>
            <Tables
              columns={[
                { header: '', accessor: 'checkbox' },
                { header: '이름', accessor: 'name' },
                { header: '공급자의 네트워크 ID', accessor: 'networkId' },
                { header: '데이터 센터', accessor: 'dataCenter' },
                { header: '모두허용', accessor: 'allowAll' },
              ]}
              data={[
                { checkbox: <input type="checkbox" id="import_network_1" defaultChecked />, name: '디스크 활성화', networkId: '디스크 활성화', dataCenter: '디스크 활성화', allowAll: '디스크 활성화' },
              ]}
            />
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={onSubmit}>가져오기</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default NetworkImportModal;