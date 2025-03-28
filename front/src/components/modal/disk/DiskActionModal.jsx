import React, { useState, useEffect } from "react";
import BaseModal from "../BaseModal";
import "../domain/MDomain.css";
import Localization from "../../../utils/Localization";

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
      contentStyle={{ width: "800px" }} 
    >
      <div className="section-table-outer p-0.5">
          <h1>디스크 할당:</h1>
          <table>
            <thead>
              <tr>
                <th>{Localization.kr.ALIAS}</th>
                <th>가상 크기</th>
                <th>소스</th>
                <th>{Localization.kr.TARGET}</th>
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
