import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../domain/css/MDomain.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { 
  useDiskById
} from '../../../../api/RQHook';
import { formatBytesToGBToFixedZero } from '../../../../utils/format';

const FormGroup = ({ label, children }) => (
  <div className="img-input-box ">
    <label>{label}</label>
    {children}
  </div>
);

const DiskActionModal = ({ isOpen, action, data=[], onClose }) => {
  useEffect(() => {
    if (data) {
      console.log("Received data in DiskActionModal:", data);
    } else {
      console.log("No data provided to DiskActionModal.");
    }
  }, [data]);
  const handleFormSubmit = () => {
    // const error = validateForm();
    // if (error) {
    //   alert(error);
    //   return;
    // }

    // const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환
    // const appendSizeToBytes = parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환 (기본값 0)

    // const selectedDataCenter = datacenters.find((dc) => dc.id === dataCenterVoId);
    // const selectedDomain = domains.find((dm) => dm.id === domainVoId);
    // const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVoId);


    // // 데이터 객체 생성
    // const dataToSubmit = {
      
    // };

    // console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그
    
    // if (editMode) {
    //   editDisk(
    //     { diskId: formState.id, diskData: dataToSubmit },
    //     {
    //       onSuccess: () => {
    //         alert("디스크 편집 완료");
    //         onRequestClose(); // 성공 시 모달 닫기
    //       },
    //     }
    //   );
    
    // } else {
    //   // 일반 디스크 생성
    //   addDisk(dataToSubmit, {
    //     onSuccess: () => {
    //       alert("디스크 생성 완료");
    //       onRequestClose();
    //     },
    //   });
    // }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={action === 'move' ? '디스크 이동' : '디스크 복사'}
      className="Modal"
      overlayClassName="Overlay newRolePopupOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="disk-move-popup modal">
        <div className="popup-header">
          <h1>{action === 'move' ? '디스크 이동' : '디스크 복사'}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth/>
          </button>
        </div>

        <div className="section-table-outer p-0.5">
          <span style={{fontWeight:'800'}}>디스크 할당:</span>
          <table>
            <thead>
              <tr>
                <th>별칭</th>
                <th>가상 크기</th>
                <th>소스</th>
                <th>대상</th>
                <th>디스크 프로파일</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((disk, index) => (
                  <tr key={index}>
                    <td>{disk.alias || "N/A"}</td>
                    <td>{disk?.virtualSize}</td>
                    <td>{disk.storageDomainVo.name || "N/A"}</td>
                    <td>
                      <select>
                        {Array.isArray(disk.targets) ? (
                          disk.targets.map((target, i) => (
                            <option key={i} value={target.value || ""}>
                              {target.label || "Unknown"}
                            </option>
                          ))
                        ) : (
                          <option value="">No targets available</option>
                        )}
                      </select>
                    </td>
                    <td>
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>



          </table>
        </div>

        <div className="edit-footer">
          <button onClick={handleFormSubmit}>
            {action === 'move' ? '이동' : '복사'}
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DiskActionModal;