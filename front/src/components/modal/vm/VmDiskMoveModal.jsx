import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import { 
  useAllStorageDomainsToMoveFromDisk4EachDisk,
  useMoveDisk,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import "../domain/MDomain.css";
import { checkZeroSizeToGiB } from "@/util";

const VmDiskMoveModal = ({ 
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, disksSelected } = useGlobal()
  
  const vm = useMemo(() => [...vmsSelected][0], [vmsSelected]);
  
  const [diskList, setDiskList] = useState([]);
  const [domainList, setDomainList] = useState({});
  const [targetDomains, setTargetDomains] = useState({});
  console.log("$disksSelected", disksSelected)
  const { mutate: moveDisk } = useMoveDisk(onClose, onClose);

  useEffect(() => {
    if (isOpen && disksSelected.length > 0) {
      setDiskList(disksSelected);
    }
  }, [isOpen]);

  const qr = useAllStorageDomainsToMoveFromDisk4EachDisk(diskList, (e) => ({ ...e }));
  
  const isQrSuccess = useMemo(() => {
    return qr.every((q) => q?.isSuccess);
  }, [qr]);

  useEffect(() => {
    const newDomainList = {};

    for (let i = 0; i < qr.length; i++) {
      const allDomains = qr[i]?.data ?? []
      const disk = diskList[i];
      const currentDomainId = disk?.diskImageVo?.storageDomainVo?.id;

      const filteredDomains = [...allDomains].filter((d) => {
        return d.status?.toUpperCase() === "ACTIVE" && d.id !== currentDomainId;
      }).map((d) => ({
        id: d.id,
        name: d.name,
        availableSize: d.availableSize,
        usedSize: d.usedSize,
      }));
      newDomainList[disk?.id] = filteredDomains;
    }

    const isDifferent = JSON.stringify(domainList) !== JSON.stringify(newDomainList);
    if (isDifferent) {
      setDomainList(newDomainList);
    }
  }, [qr, diskList]);
  
  useEffect(() => {
    // domainList가 갱신될 때마다 실행
    if (!domainList || Object.keys(domainList).length === 0) return;

    setTargetDomains(prev => {
      const next = { ...prev };
      let changed = false;

      Object.entries(domainList).forEach(([diskId, domains]) => {
        if (domains && domains.length > 0 && !next[diskId]) {
          next[diskId] = domains[0].id;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [domainList]);

  
  const validateForm = () => {
    if (!diskList.length) return "가져올 디스크가 없습니다.";
    
    for (const disk of diskList) {
      const selectedDomainId = targetDomains[disk.id];
      if (!selectedDomainId || selectedDomainId.trim() === "none") {
        return `"${disk.alias}" 디스크에 디스크 프로파일이 지정되지 않았습니다.`;
      }
    }

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    diskList?.forEach((disk) => {
      let selectedDomainId = targetDomains[disk.id];
  
      if (!selectedDomainId) {
        const availableDomains = domainList[disk.id] || [];
        if (availableDomains.length > 0) {
          selectedDomainId = availableDomains[0].id;
        } else {
          validationToast.fail(`선택한 ${disk.alias || "디스크"} ${Localization.kr.DOMAIN}이 없습니다.`);
          return;
        }
      }
  
      moveDisk({
        diskId: disk.id,
        storageDomainId: selectedDomainId
      });
    });
  };

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.DISK}`} submitTitle={Localization.kr.MOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px" }}
    >
    <div className="py-3">
      <div className="section-table-outer">
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
            {diskList.length > 0 ? (
              diskList?.map((disk, index) => {
                const image = disk?.diskImageVo;

                return (
                  <tr key={disk.id || index}>
                    <td>{image.alias}</td>
                    <td>{checkZeroSizeToGiB(image?.virtualSize)}</td>
                    <td>{image.storageDomainVo?.name || ""}</td>
                    <td className="w-[230px]">
                      <LabelSelectOptionsID className="w-full"
                        value={targetDomains[disk.id] || ""}
                        options={domainList[disk.id] || []}
                        onChange={(selected) => {
                          setTargetDomains((prev) => ({ ...prev, [disk.id]: selected.id }));
                        }}
                      />
                      {targetDomains[disk.id] && (() => {
                        const domainObj = (domainList[disk.id] || []).find((d) => d.id === targetDomains[disk.id]);
                        if (!domainObj) return null;
                        return (
                          <div className="text-xs text-gray-500 mt-1">
                            사용 가능: {checkZeroSizeToGiB(domainObj.availableSize)} {" / "} 총 용량: {checkZeroSizeToGiB(domainObj.availableSize + domainObj.usedSize)}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
              )})
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

export default VmDiskMoveModal;
