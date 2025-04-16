import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useAllDataCenters, useAttachDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DomainAttachModal
 * @description 도메인 - 데이터센터 연결
 *
 * @param {boolean} isOpen
 *
 * @returns
 */
const DomainAttachModal = ({ 
  isOpen, 
  actionType=true, // true면 데이터센터에서 도메인을 붙이는 (도메인 연결)
  domainId,
  datacenterId,
  onClose 
}) => {
  const onSuccess = () => {
    toast.success(`${Localization.kr.DOMAIN} 연결 완료`);
    onClose();
  };
  const { mutate: attachDomain } = useAttachDomain(onSuccess, () => onClose());
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));

  const [vo, setVo] = useState({ id: "", name: "" });

  const [selectedId, setSelectedId] = useState(null); // 단일 값으로 변경
  const [selectedName, setSelectedName] = useState(null); // 단일 값으로 변경

  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow?.id) {
      Logger.debug(`선택한 ID: ${selectedRow.id}`);
      setSelectedId(selectedRow.id);
      setSelectedName(selectedRow.name);
    }
  };

  const handleFormSubmit = () => {
    if (!selectedId) return toast.error(`${Localization.kr.DATA_CENTER}를 선택하세요.`);

    attachDomain({ storageDomainId: domainId, dataCenterId: selectedId });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={"연결"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}} 
    >
      <div>
        <TablesOuter
          isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
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
    </BaseModal>
  );
};

export default DomainAttachModal;
