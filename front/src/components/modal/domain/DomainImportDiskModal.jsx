import React, { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import BaseModal                        from "../BaseModal";
import { 
  useAllDiskProfilesFromDomain,
  useAllUnregisteredDisksFromDomain,
  useRegisteredDiskFromDomain,
  useUnregisteredDiskFromDomain
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "../domain/MDomain.css";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import { handleSelectIdChange } from "@/components/label/HandleInput";

const DomainImportDiskModal = ({
  isOpen,
  onClose,
  domainId,
  diskIds
}) => {
  const { validationToast } = useValidationToast();

  const {
      data: disks = [],
      isLoading: isDisksLoading,
      isError: isDisksError,
      isSuccess: isDisksSuccess,
      refetch: refetchDisks,
      isRefetching: isDisksRefetching,
  } = useAllUnregisteredDisksFromDomain(domainId, (e) => ({ ...e }));
  // const { data: disk } =  
  //   useUnregisteredDiskFromDomain(domainId, diskIds, (e) => ({ ...e }));
    
  // useEffect(() =>{
  //   console.log("$ disk", disk)
  // }, []);

  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading, 
    isError: isDiskProfilesError,
    isSuccess: isDiskProfilesSuccess
  } = useAllDiskProfilesFromDomain(domainId, (e) => ({ ...e }));
    
  const { mutate: registerDisk } = useRegisteredDiskFromDomain(onClose, onClose);

  const [diskProfileVo, setDiskProfileVo] = useState({ id: "", name: "" });

  const validateForm = () => {
    
    return null
  }

  const handleFormSubmit = () => {
    const error = validateForm()
    if (error) {
      validationToast.fail(error);
      return;
    }

    diskIds.forEach((diskId, index) => {
      Logger.debug(`DomainGetDiskModal > handleFormSubmit ... domainId: ${domainId}, diskId: ${diskId}`);
      registerDisk({ storageDomainId: domainId, diskId });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px" }} 
    >
      <div className="section-table-outer ">
        <span style={{ fontWeight: "800" }}>디스크 할당:</span>
        <table>
          <thead>
            <tr>
              <th>{Localization.kr.ALIAS}</th>
              <th>가상 크기</th>
              {/* <th>디스크 프로파일</th> */}
            </tr>
          </thead>
          <tbody>
          {(Array.isArray(diskIds) ? diskIds : []).map((id, index) => (
              <tr key={index}>
                {/* <td>{disk.alias}</td> */}
                {/* <td>{disk.virtualSize}</td> */}

                <LabelSelectOptionsID label={Localization.kr.DISK_PROFILE}
                  value={diskProfileVo.id}
                  loading={isDiskProfilesLoading}
                  options={diskProfiles}
                  onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles)}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default DomainImportDiskModal;
