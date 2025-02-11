import React, { useState } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { useAllDataCenters, useAttachDomain } from '../../../../api/RQHook';
import { xButton } from '../../../../utils/Icon';
import TablesOuter from '../../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../../components/table/TableColumnsInfo';

// 도메인 - 데이터센터 연결
// action으로 type 전달
const DomainAttachModal = ({ isOpen, data, onClose }) => {
  const { mutate: attachDomain } = useAttachDomain();
  const { data: datacenters = [] } = useAllDataCenters((e) => ({ ...e }));
    
  const [selectedId, setSelectedId] = useState(null); // 단일 값으로 변경
  const [selectedName, setSelectedName] = useState(null); // 단일 값으로 변경

  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow?.id) {
      console.log('선택한 ID:', selectedRow.id);
      setSelectedId(selectedRow.id);
      setSelectedName(selectedRow.name);
    }
  };

  const handleFormSubmit = () => {
    if (!selectedId) return toast.error('데이터센터를 선택하세요.');

    console.log(`domain: ${data?.id}, dc: ${selectedId}`)
    attachDomain({ storageDomainId: data?.id, dataCenterId: selectedId },{
      onSuccess: () => {
        onClose();
        toast.success(`도메인 데이터센터 ${selectedName} 연결 완료`);
      },
      onError: (error) => {
        toast.error(`도메인 데이터센터 ${selectedName} 연결 실패: ${error.message}`);
      },
    });
  };
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={'attach'} className="Modal" overlayClassName="Overlay" shouldCloseOnOverlayClick={false} >
      <div className="get-vm-template modal">
        <div className="popup-header">
          <h1> 스토리지 도메인 연결</h1>
          <button onClick={onClose}> { xButton() } </button>
        </div>

        <div className="datacenter-new-content modal-content">
          <div>
            <TablesOuter
              columns={TableColumnsInfo.DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN}
              data={datacenters.map((datacenter) => ({
                ...datacenter,
                name: datacenter?.name,
                storageType: datacenter?.storageType ? '로컬' : '공유됨'
              }))}
              shouldHighlight1stCol={true}
              onRowClick={ (row) => handleRowClick(row) }
            />
          </div>
          <span>id: {selectedId}</span>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DomainAttachModal;
