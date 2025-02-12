import React, { useMemo } from 'react';
import Modal from 'react-modal';
import '../domain/MDomain.css'
import { useRegisteredDiskFromDomain } from '../../../api/RQHook';
import toast from 'react-hot-toast';
import { xButton } from '../../Icon';

const DomainGetDiskModal = ({ isOpen, domainId, data, onClose }) => {
  const { mutate: registerDisk } = useRegisteredDiskFromDomain();
  
  console.log("DomainGetDiskModal: ", data);
  console.log("domainId: ", domainId);

  const { ids } = useMemo(() => {
    if (!data) return { ids: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
    };
  }, [data]);

  // diskprofile 일단 생략
  const handleFormSubmit = () => {
    if (ids.length === 0) return toast.error('불러올 디스크가 없습니다.');

    ids.forEach((diskId, index) => {
      console.log(`post domainId: ${domainId}, diskId: ${diskId}`)

      registerDisk({storageDomainId:domainId, diskId}, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            onClose();
            toast.success("디스크 불러오기 성공")
          }
        },
        onError: (error) => { toast.error(`디스크 불러오기 오류:`, error) },
      });
    });
  };
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={'디스크 불러오기'} className="Modal" overlayClassName="Overlay newRolePopupOverlay" shouldCloseOnOverlayClick={false} >
      <div className="disk-move-popup modal">
        <div className="popup-header">
          <h1>디스크 불러오기</h1>
          <button onClick={onClose}> { xButton() } </button>
        </div>

        <div className="section-table-outer p-0.5">
          <span style={{ fontWeight: '800' }}>디스크 할당:</span>
          <table>
            <thead>
              <tr>
                <th>별칭</th>
                <th>가상 크기</th>
                {/* <th>디스크 프로파일</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((disk, index) => (
                <tr key={index}>
                  <td>{disk.alias}</td>
                  <td>{disk.virtualSize}</td>
                 
                  {/* <td>
                    <select>
                      {Array.isArray(disk.profiles) ? (
                        disk.profiles.map((profile, i) => (
                          <option key={i} value={profile.value || ""}>
                            {profile.label || "Unknown"}
                          </option>
                        ))
                      ) : (
                        <option value="">No profiles available</option>
                      )}
                    </select>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
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

export default DomainGetDiskModal;
