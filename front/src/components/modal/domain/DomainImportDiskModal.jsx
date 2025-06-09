import React, { useEffect, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import BaseModal                        from "../BaseModal";
import { 
  useAllDiskProfilesFromDomain,
  useRegisteredDiskFromDomain,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "../domain/MDomain.css";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import useGlobal from "@/hooks/useGlobal";

const DomainImportDiskModal = ({
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { domainsSelected, disksSelected } = useGlobal()
  
  const [diskList, setDiskList] = useState([]);
  const [diskProfileList, setDiskProfileList] = useState({});
  
  const { 
    data: diskProfiles = [],
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfilesFromDomain(domainsSelected[0]?.id, (e) => ({ ...e }));

  const { mutate: registerDisk } = useRegisteredDiskFromDomain(onClose, onClose);
  
  useEffect(() => {
    if (isOpen && disksSelected.length > 0) {
      setDiskList(disksSelected);
    }
  }, [isOpen]);

  useEffect(() => {
    if (diskList?.length && diskProfiles.length) {
      setDiskProfileList((prev) => {
        const next = { ...prev };
        diskList.forEach(disk => {
          if (!next[disk.id]) {
            next[disk.id] = diskProfiles[0].id;
          }
        });
        return next;
      });
    }
  }, [diskList, diskProfiles]);

  const handleDiskProfileChange = (diskId) => (selected) => {
    setDiskProfileList(prev => ({ ...prev, [diskId]: selected.id }));
  };

  const validateForm = () => {
    if (!diskList.length) return "가져올 디스크가 없습니다.";
    
    for (const disk of diskList) {
      const profileId = diskProfileList[disk.id];
      if (!profileId || profileId.trim() === "none") {
        return `"${disk.alias}" ${Localization.kr.DISK}에 ${Localization.kr.DISK_PROFILE}이 지정되지 않았습니다.`;
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
    
    diskList.forEach((disk) => {
      const profileId = diskProfileList[disk.id];
      if (!profileId) return;

      console.log("$ 디스크 submit:", domainsSelected[0]?.id, "disk ", disk.id, "profile ", profileId);

      registerDisk({
        storageDomainId: domainsSelected[0]?.id,
        diskImageVo: {
          id: disk?.id,
          diskProfileVo: { id: profileId }
        },
      });
    });
  };


  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "780px" }} 
    >
      <div className="section-table-outer ">
        <table>
          <thead>
            <tr>
              <th>{Localization.kr.ALIAS}</th>
              <th>{Localization.kr.SIZE_VIRTUAL}</th>
              <th>{Localization.kr.DISK_PROFILE}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(diskList) && diskList.map((disk) => (
              <tr key={disk.id}>
                <td>{disk.alias}</td>
                <td>{disk.virtualSize}</td>
                <td className="w-[230px]">
                  <LabelSelectOptionsID
                    value={diskProfileList[disk.id] || ""}
                    loading={isDiskProfilesLoading}
                    options={diskProfiles}
                    onChange={handleDiskProfileChange(disk.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default DomainImportDiskModal;
