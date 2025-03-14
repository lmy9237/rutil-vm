import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useCopyDisk, useDiskById } from "../../../api/RQHook";
import "../domain/MDomain.css";

const DiskActionModal = ({ isOpen, action, data = [], onClose }) => {
  // const { mutate: copyDisk } = useCopyDisk();
  const daLabel = action === "move" ? "이동" : "복사"
  
  const handleFormSubmit = () => {
    
  };
  
  console.log("DiskActionModal:", data);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"디스크"}
      submitTitle={daLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "650px", height: "340px" }} 
    >
      <div className="popup-content-outer">
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
      </div>
    </BaseModal>
  );
};

export default DiskActionModal;
