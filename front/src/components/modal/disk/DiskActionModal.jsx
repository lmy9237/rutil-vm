import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDiskById } from "../../../api/RQHook";
import { formatBytesToGBToFixedZero } from "../../../util";
import "../domain/MDomain.css";

const FormGroup = ({ label, children }) => (
  <div className="img-input-box ">
    <label>{label}</label>
    {children}
  </div>
);

const DiskActionModal = ({ isOpen, action, data = [], onClose }) => {
  useEffect(() => {
    if (!data) {
      console.warn("No data provided to DiskActionModal.");
      return;
    }
    console.log("Received data in DiskActionModal:", data);
  }, [data]);

  const handleFormSubmit = () => {
    console.log("DiskActionModal > handleFormSubmit ... ");
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
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"디스크"}
      submitTitle={action === "move" ? "이동" : "복사"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="disk-move-popup modal"> */}
      <div className="section-table-outer p-0.5">
        <span style={{ fontWeight: "800" }}>디스크 할당:</span>
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
    </BaseModal>
  );
};

export default DiskActionModal;
