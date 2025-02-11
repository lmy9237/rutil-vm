import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../domain/css/MDomain.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const DomainGetDiskModal = ({ isOpen, action, data = [], onClose }) => {
  useEffect(() => {
    if (data.length > 0) {
      console.log("Received data in DiskActionModal:", data);
    } else {
      console.log("No data provided to DiskActionModal.");
    }
  }, [data]);

  // 임시 데이터 (데이터가 없을 경우 기본값 사용)
  const placeholderData = [
    {
      alias: "Disk-001",
      virtualSize: "100GB",
      profiles: [{ value: "profile1", label: "Profile A" }, { value: "profile2", label: "Profile B" }],
    },
    {
      alias: "Disk-002",
      virtualSize: "200GB",
      profiles: [{ value: "profile3", label: "Profile C" }, { value: "profile4", label: "Profile D" }],
    }
  ];

  const diskData = Array.isArray(data) && data.length > 0 ? data : placeholderData;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={'디스크 불러오기'}
      className="Modal"
      overlayClassName="Overlay newRolePopupOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="disk-move-popup modal">
        <div className="popup-header">
          <h1>디스크 불러오기</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="section-table-outer p-0.5">
          <span style={{ fontWeight: '800' }}>디스크 할당:</span>
          <table>
            <thead>
              <tr>
                <th>별칭</th>
                <th>가상 크기</th>
                <th>디스크 프로파일</th>
              </tr>
            </thead>
            <tbody>
              {diskData.map((disk, index) => (
                <tr key={index}>
                  <td>{disk.alias || "N/A"}</td>
                  <td>{disk.virtualSize || "N/A"}</td>
                 
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="edit-footer">
          <button>
            {action === 'move' ? '이동' : '복사'}
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DomainGetDiskModal;
