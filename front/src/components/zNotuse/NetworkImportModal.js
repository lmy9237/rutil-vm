import React from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Table from './Table'; // 적절한 경로에 Table 컴포넌트가 있는지 확인하세요.

const NetworkImportModal = ({ isOpen, onRequestClose, onSubmit }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="가져오기"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="network_bring_popup">
        <div className="popup_header">
          <h1>네트워크 가져오기</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="network_form_group">
          <label htmlFor="cluster" style={{ fontSize: '0.33rem', fontWeight: '600' }}>네트워크 공급자</label>
          <select id="cluster">
            <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
          </select>
        </div>

        <div id="network_bring_table_outer">
          <span className="font-bold">공급자 네트워크</span>
          <div>
            <Table
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

        <div id="network_bring_table_outer">
          <span>가져올 네트워크</span>
          <div>
            <Table
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

        <div className="edit_footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={onSubmit}>가져오기</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default NetworkImportModal;


{/* 네트워크(가져오기) */}
{/* <Modal
isOpen={activePopup === 'getNetwork'}
onRequestClose={closePopup}
contentLabel="가져오기"
className="Modal"
overlayClassName="Overlay"
shouldCloseOnOverlayClick={false}
>
<div className="network_bring_popup">
    <div className="popup_header">
        <h1>네트워크 가져오기</h1>
        <button onClick={closePopup}><FontAwesomeIcon icon={faTimes} fixedWidth/></button>
    </div>

    <div className="network_form_group">
        <label htmlFor="cluster" style={{ fontSize: '0.33rem',fontWeight:'600' }}>네트워크 공급자</label>
        <select id="cluster">
            <option value="ovirt-provider-ovn">ovirt-provider-ovn</option>
        </select>
    </div>

    <div id="network_bring_table_outer">
        <span className='font-bold'>공급자 네트워크</span>
        <div>
            <Table 
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

    <div id="network_bring_table_outer">
        <span>가져올 네트워크</span>
        <div>
            <Table 
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

    <div className="edit_footer">
        <button style={{ display: 'none' }}></button>
        <button>가져오기</button>
        <button onClick={closePopup}>취소</button>
    </div>
</div>
</Modal> */}