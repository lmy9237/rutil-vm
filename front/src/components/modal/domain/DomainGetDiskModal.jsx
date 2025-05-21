import React, { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import { useRegisteredDiskFromDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "../domain/MDomain.css";

const DomainGetDiskModal = ({
  isOpen,
  onClose,
  domainId,
  data,
}) => {
  const { toast } = useToast();
  // const { closeModal } = useUIState()
  const { mutate: registerDisk } = useRegisteredDiskFromDomain(onClose, onClose);

  Logger.debug(`DomainGetDiskModal, domainId: ${domainId}, data: `, data);
  const { ids } = useMemo(() => {
    if (!data) return { ids: [] };

    return {
      ids: [...data]?.map((item) => item.id),
    };
  }, [data]);

  const validateForm = () => {
    Logger.debug(`DomainGetDiskModal > validateForm ...`);
    if (ids.length === 0) return "불러올 디스크가 없습니다.";
    return null
  }

  // diskprofile 일단 생략
  const handleFormSubmit = () => {
    const error = validateForm()
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    ids.forEach((diskId, index) => {
      Logger.debug(
        `DomainGetDiskModal > handleFormSubmit ... domainId: ${domainId}, diskId: ${diskId}`
      );

      registerDisk({ storageDomainId: domainId, diskId });
    });
  };
  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px" }} 
    >
      {/* <div className="disk-move-popup modal"> */}
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
          {(Array.isArray(data) ? data : []).map((disk, index) => (
              <tr key={index}>
                <td>{disk.alias}</td>
                <td>{disk.virtualSize}</td>

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
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default DomainGetDiskModal;
