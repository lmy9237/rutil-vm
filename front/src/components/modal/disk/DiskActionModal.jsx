import React, { useState, useEffect } from "react";
import BaseModal from "../BaseModal";
import "../domain/MDomain.css";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import { useCopyDisk, useMoveDisk } from "../../../api/RQHook";
import toast from "react-hot-toast";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import { useQueries } from "@tanstack/react-query";
import ApiManager from "../../../api/ApiManager";
import { checkZeroSizeToGiB } from "../../../util";

const DiskActionModal = ({ 
  isOpen,
  action,
  data=[], 
  onClose
}) => {
  const daLabel = action === "move" ? "이동" : "복사";
  const [domainList, setDomainList] = useState({});
  const [targetDomains, setTargetDomains] = useState({});

  Logger.debug(`DiskActionModal.data: `, data);
  const onSuccess = () => {
    onClose();
    toast.success(`디스크 ${daLabel} 완료`);
  };
  const { mutate: copyDisk } = useCopyDisk(onSuccess, () => onClose());
  const { mutate: moveDisk } = useMoveDisk(onSuccess, () => onClose());

  const getDomains = useQueries({
    queries: data.map((disk) => ({
      queryKey: ['allDomainsFromDataCenter', disk.dataCenterVo.id],
      queryFn: async () => {
        try {
          const domains = await ApiManager.findAllDomainsFromDataCenter(disk.dataCenterVo?.id);
          return domains || [];
        } catch (error) {
          console.error(`Error fetching ${disk}`, error);
          return [];
        }
      }
    })),
  });  

  
  useEffect(() => {
    const newDomainList = {};
  
    getDomains.forEach((queryResult, idx) => {
      const disk = data[idx]; // 각 디스크와 매핑
      const currentDomainId = disk?.storageDomainVo?.id;
  
      if (disk && queryResult.data && !queryResult.isLoading) {
        const domains = queryResult.data.body || queryResult.data || [];
  
      // TODO: 복사는 도메인이 전부 떠야함 filter 처리하기
        // 디스크가 속한 도메인 제외
        const filteredDomains = domains
          .filter((d) => d.status === "ACTIVE" && d.id !== currentDomainId)
          .map((d) => ({ id: d.id, name: d.name }));
  
        newDomainList[disk.id] = filteredDomains;
      }
    });
  
    const isDifferent = JSON.stringify(domainList) !== JSON.stringify(newDomainList);
    if (isDifferent) {
      setDomainList(newDomainList);
    }
  }, [getDomains, data]);  
  
  Logger.debug(`domainList: `, domainList);

  // 같은 데이터센터 안에 잇는 스토리지 도메인 목록을 불러와야함

  const handleFormSubmit = () => {
    data.forEach((disk) => {
      const selectedDomainId = targetDomains[disk.id];
  
      if (!selectedDomainId) {
        toast.error(`${disk.alias || "디스크"}에 대해 타겟 스토리지 도메인이 선택되지 않았습니다.`);
        return;
      }
  
      if (action === "move") {
        moveDisk({ diskId: disk.id,storageDomainId: selectedDomainId });
      } else {
        copyDisk({ diskId: disk.id, storageDomainId: selectedDomainId });
      }
    });
  };
  

  return (
    <BaseModal targetName={"디스크"} submitTitle={daLabel}
      isOpen={isOpen} onClose={onClose}
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
              <th>현재 스토리지 도메인</th>
              <th>{Localization.kr.TARGET} 스토리지 도메인</th>
              {/* <th>{Localization.kr.DISK_PROFILE}</th> */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((disk, index) => (
                <tr key={index}>
                  <td>{disk.alias || "N/A"}</td>
                  <td>{disk?.virtualSize}</td>
                  <td>{disk.storageDomainVo.name || ""}</td>
                  <td>
                    <LabelSelectOptionsID
                      value={targetDomains[disk.id] || ""}
                      options={domainList[disk.id] || []}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setTargetDomains((prev) => ({...prev, [disk.id]: selectedId }));
                      }}
                    />
                    {/* 디스크 용량 나오게 */}
                  </td>
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
