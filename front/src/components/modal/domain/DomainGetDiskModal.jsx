import React, { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useRegisteredDiskFromDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "../domain/MDomain.css";

const DomainGetDiskModal = ({
  isOpen,
  domainId,
  data,
  onClose
}) => {
  const { mutate: registerDisk } = useRegisteredDiskFromDomain();

  Logger.debug(`DomainGetDiskModal, domainId: ${domainId}, data: `, data);
  const { ids } = useMemo(() => {
    if (!data) return { ids: [] };

    return {
      ids: [...data]?.map((item) => item.id),
    };
  }, [data]);

  // diskprofile 일단 생략
  const handleFormSubmit = () => {
    if (ids.length === 0) {
      toast.error("불러올 디스크가 없습니다.");
      return;
    }

    ids.forEach((diskId, index) => {
      Logger.debug(
        `DomainGetDiskModal > handleFormSubmit ... domainId: ${domainId}, diskId: ${diskId}`
      );

      registerDisk(
        { storageDomainId: domainId, diskId },
        {
          onSuccess: () => {
            if (ids.length === 1 || index === ids.length - 1) {
              onClose();
              toast.success("디스크 불러오기 성공");
            }
          },
          onError: (error) => {
            toast.error(`디스크 불러오기 오류:`, error);
          },
        }
      );
    });
  };
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"디스크"}
      submitTitle={"불러오기"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px" }} 
    >
      {/* <div className="disk-move-popup modal"> */}
      <div className="section-table-outer p-0.5">
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
            {data.map((disk, index) => (
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
