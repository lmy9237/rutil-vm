import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useDeleteDataCenter,
  useDeleteCluster,
  useDeleteHost,
  useDeleteTemplate,
  useDeleteNetwork,
  useDeleteVnicProfile,
  useDeleteNetworkInterface,
  useDeleteDisk,
  useDeleteNetworkFromTemplate,
  useDeleteSnapshot,
  useDeleteDiskFromVM
} from '../api/RQHook';

const DeleteModal = ({ 
    isOpen, 
    type,
    onRequestClose, 
    contentLabel, 
    data,
    networkId,// 외부에서 전달된 prop TODO 바꿔야함
    vmId,
    templateId,
}) => {
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);

  const { mutate: deleteDataCenter } = useDeleteDataCenter();
  const { mutate: deleteCluster } = useDeleteCluster();
  const { mutate: deleteHost } = useDeleteHost();
  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { mutate: deleteNetwork } = useDeleteNetwork();
  const { mutate: deleteVnicProfile } = useDeleteVnicProfile();
  const { mutate: deleteNetworkInterface } = useDeleteNetworkInterface();
  const { mutate: deleteNicFromTemplate } = useDeleteNetworkFromTemplate();
  const { mutate: deleteDisk } = useDeleteDisk();
  const { mutate: deleteSnapshot } = useDeleteSnapshot();
  const { mutate: deleteDiskFromVM } = useDeleteDiskFromVM();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        // data가 배열인 경우
        setId(data.map((item) => item.id));
        setName(data.map((item) => item.name || item.alias || '').join(', '));
      } else {
        // data가 단일 객체인 경우
        setId([data.id]);
        setName([data.name || data.alias || '']);
      }
    }
  }, [data]);

  useEffect(() => {
    console.log('DeleteModal:', data, +id);
  }, [data, id]);

  const handleFormSubmit = () => {
    if (!id) {
      console.error('ID가 없습니다. 삭제 요청을 취소합니다.');
      return;
    }

    if (type === 'DataCenter') {
      console.log('Deleting DataCenter');
      id.forEach((datacenterId, index) => {
        handleDelete(() => deleteDataCenter(datacenterId), name[index]); 
      });
    } else if (type === 'Cluster') {
      console.log('Deleting Cluster');
      id.forEach((clsuterId, index) => {
        handleDelete(() => deleteCluster(clsuterId), name[index]); 
      });
      onRequestClose();
    } else if (type === 'Host') {
      console.log('Deleting Host');
      id.forEach((hostId, index) => {
        handleDelete(() => deleteHost(hostId), name[index]);
      });
    } else if (type === 'Template') {
      console.log('Deleting Template');
      id.forEach((templateId, index) => {
        handleDelete(() => deleteTemplate(templateId), name[index]);
      });
      onRequestClose();
    } else if (type === 'Network') {
      console.log('Deleting Network');
      id.forEach((networkId, index) => {
        handleDelete(() => deleteNetwork(networkId), name[index]); 
      });
      onRequestClose();
    }else if (type === 'vnicProfile') {
      console.log('Deleting vnicProfile');
      id.forEach((vnicProfileId, index) => {
        handleDelete(
          () => deleteVnicProfile(vnicProfileId), name[index]);
      });
      onRequestClose();
    } else if (type === 'NetworkInterface') {
      handleDelete(() => deleteNetworkInterface({ vmId, nicId: id }));
      console.log('Deleting NetworkInterface');
      onRequestClose();
    }else if (type === 'NetworkInterfaceFromTemplate' || type === 'TemplateNic') {
      id.forEach((nicId) => {
        handleDelete(() => deleteNicFromTemplate({ templateId, nicId }));
      });
      console.log('Deleting NicFromTemplate');
      onRequestClose();
    }else if (type === 'Disk') {
      console.log('Deleting Disk');
      id.forEach((diskkId, index) => {
        handleDelete(() => deleteDisk(diskkId), name[index]); // 각 네트워크를 개별적으로 삭제
      });
      onRequestClose();
    }else if (type === 'Snapshot') {
      console.log('Deleting Snapshots');
      id.forEach((snapshotId, index) => {
        handleDelete(() =>
          deleteSnapshot(
            { vmId, snapshotId },
          )
        );
      });
      onRequestClose();
    }else if (type === 'vmDisk') {
      console.log('Deleting vmDisk');
      handleDelete(() => deleteDiskFromVM({ vmId, diskAttachmentId: id }));
      onRequestClose();
    }else if(type ==='TemplateNic'){
      handleDelete(() => deleteNicFromTemplate({ templateId, nicId: id }));
      console.log('Deleting NicFromTemplate');
      onRequestClose();
    }
  };

  const handleDelete = (deleteFn) => {
    deleteFn(id, {
      onSuccess: () => {
        onRequestClose(); // 삭제 성공 시 모달 닫기
        
        if (type === 'DataCenter') {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate('/computing/rutil-manager/datacenters');
        } else if (type === 'Cluster') {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate('/computing/rutil-manager/clusters');
        } else if (type === 'Host') {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate('/computing/rutil-manager/hosts');
        } else {
          // 다른 타입일 경우 기본 동작 수행
          const currentPath = location.pathname;
          if (currentPath.includes(id)) {
            const newPath = currentPath.replace(`/${id}`, '');
            navigate(newPath);
          } else {
            window.location.reload();
          }
        }
      },
      onError: (error) => {
        console.error(`${contentLabel} ${name} 삭제 오류:`, error);
      },
    });
  };
  

  return (
    <Modal
      isOpen={true} // isopen
      onRequestClose={onRequestClose}
      contentLabel={`${contentLabel}`}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-delete-popup">
        <div className="popup-header">
          <h1>{contentLabel} 삭제</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {name} 를(을) 삭제하시겠습니까? </span>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;

