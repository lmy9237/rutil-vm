import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useAllDataCenters, useAttachDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainAttachModal
 * @description 도메인 - 데이터센터 연결
 *
 * @param {boolean} isOpen
 *
 * @returns
 */
const DomainAttachModal = ({ isOpen, data, onClose }) => {
  const { mutate: attachDomain } = useAttachDomain();
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));

  const [selectedId, setSelectedId] = useState(null); // 단일 값으로 변경
  const [selectedName, setSelectedName] = useState(null); // 단일 값으로 변경

  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow?.id) {
      console.log(`선택한 ID: ${selectedRow.id}`);
      setSelectedId(selectedRow.id);
      setSelectedName(selectedRow.name);
    }
  };

  const handleFormSubmit = () => {
    if (!selectedId) return toast.error(`${Localization.kr.DATA_CENTER}를 선택하세요.`);

    console.log(`domain: ${data?.id}, dc: ${selectedId}`);
    attachDomain(
      { storageDomainId: data?.id, dataCenterId: selectedId },
      {
        onSuccess: () => {
          onClose();
          toast.success(`도메인 ${Localization.kr.DATA_CENTER} ${selectedName} 연결 완료`);
        },
        onError: (error) => {
          toast.error(
            `도메인 ${Localization.kr.DATA_CENTER} ${selectedName} 연결 실패: ${error.message}`
          );
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스토리지 도메인"}
      submitTitle={"연결결"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px", height: "450px" }} 
    >
      <div className="popup-content-outer">
        <div>
          <TablesOuter
            isLoading={isDataCentersLoading}
            isError={isDataCentersError}
            isSuccess={isDataCentersSuccess}
            columns={TableColumnsInfo.DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN}
            data={datacenters.map((datacenter) => ({
              ...datacenter,
              name: datacenter?.name,
              storageType: datacenter?.storageType ? "로컬" : "공유됨",
            }))}
            shouldHighlight1stCol={true}
            onRowClick={(row) => handleRowClick(row)}
          />
        </div>
        <span>id: {selectedId}</span>
      </div>
    </BaseModal>
  );
};

export default DomainAttachModal;
