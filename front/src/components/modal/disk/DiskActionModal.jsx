import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import BaseModal from "../BaseModal";
import Localization from "../../../utils/Localization";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import ApiManager from "../../../api/ApiManager";
import { useCopyDisk, useMoveDisk } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import "../domain/MDomain.css";

const DiskActionModal = ({ 
  isOpen,
  action,
  data=[], // 배열일수도 한개만 들어올수도
  onClose
}) => {
  const daLabel = action === "move" ? Localization.kr.MOVE : "복사";
  const [aliases, setAliases] = useState({});
  const [domainList, setDomainList] = useState({});
  const [targetDomains, setTargetDomains] = useState({});

  Logger.debug(`DiskActionModal ... data: `, data);
  const disks = !Array.isArray(data) ? [data] : data;

  const onSuccess = () => {
    onClose();
    toast.success(`디스크 ${daLabel} 완료`);
  };
  const { mutate: copyDisk } = useCopyDisk(onSuccess, () => onClose());
  const { mutate: moveDisk } = useMoveDisk(onSuccess, () => onClose());


  const getDomains = useQueries({
    queries: disks.map((disk) => ({
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
    if (action === "copy") {
      const initialAliases = {};
      for (let i=0; i<disks.length; i++) {
        const disk = disks[i];
        initialAliases[disk.id] = `${disk.alias || ""}`;
      }
      setAliases(initialAliases);
    }
  }, [action, disks]);  

  useEffect(() => {
    const newDomainList = {};

    for (let i=0; i<getDomains.length; i++) {
      // getDomains.forEach((queryResult, idx) => {
      const queryResult = getDomains[i];
      const disk = disks[i]; // 각 디스크와 매핑
      const currentDomainId = disk?.storageDomainVo?.id;
  
      if (disk && queryResult.data && queryResult.isSuccess) {
        const domains = queryResult.data?.body ?? [];
  
        const filteredDomains = domains
          .filter((d) => d.status === "ACTIVE" && (action !== "move" || d.id !== currentDomainId))
          .map((d) => ({ id: d.id, name: d.name }));
  
        newDomainList[disk.id] = filteredDomains;
      }
    }
    // });
  
    const isDifferent = JSON.stringify(domainList) !== JSON.stringify(newDomainList);
    if (isDifferent) {
      setDomainList(newDomainList);
    }
  }, [getDomains, data]);  
  
  domainList && Logger.debug(`DiskActionModal > domainList: `, domainList);

  // 같은 데이터센터 안에 잇는 스토리지 도메인 목록을 불러와야함
  const handleFormSubmit = () => {
    disks.forEach((disk) => {
      let selectedDomainId = targetDomains[disk.id];
  
      // 선택된 도메인이 없다면, 첫 번째 도메인 자동 선택
      if (!selectedDomainId) {
        const availableDomains = domainList[disk.id] || [];
        if (availableDomains.length > 0) {
          selectedDomainId = availableDomains[0].id;
        } else {
          toast.error(`선택한 ${disk.alias || "디스크"} 스토리지 도메인이 없습니다.`);
          return;
        }
      }
  
      // 복사 or 이동 처리
      if (action === "copy") {
        copyDisk({
          diskId: disk.id,
          diskImage: {
            id: disk.id,
            alias: aliases[disk.id] || disk.alias,
            storageDomainVo: { id: selectedDomainId }
          }
        });
      } else {
        moveDisk({
          diskId: disk.id,
          storageDomainId: selectedDomainId
        });
      }
    });
  };
  

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={daLabel}
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
              <th>{Localization.kr.SIZE_VIRTUAL}</th>
              <th>현재 {Localization.kr.DOMAIN}</th>
              <th>{Localization.kr.TARGET} {Localization.kr.DOMAIN}</th>
              {/* <th>{Localization.kr.DISK_PROFILE}</th> */}
            </tr>
          </thead>
          <tbody>
            {disks.length > 0 ? (
              disks.map((disk, index) => (
                <tr key={disk.id || index}>
                  <td>
                    {action === "move" ? (
                      disk.alias
                    ) : (
                      <LabelInput
                        label={""}
                        value={aliases[disk.id] || ""}
                        onChange={(e) => {
                          const newAlias = e.target.value;
                          setAliases((prev) => ({ ...prev, [disk.id]: newAlias }));
                        }}
                      />
                    )}
                  </td>
                  <td>{disk?.virtualSize}</td>
                  <td>{disk.storageDomainVo?.name || ""}</td>
                  <td>
                    <LabelSelectOptionsID
                      value={targetDomains[disk.id] || ""}
                      options={domainList[disk.id] || []}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setTargetDomains((prev) => ({ ...prev, [disk.id]: selectedId }));}}
                    />
                    <span></span>
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
