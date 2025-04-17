import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useAllDataCenters, useAllStorageDomains, useAttachDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import { checkZeroSizeToGiB } from "../../../util";

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
  sourceContext,
  domainId,
  datacenterId,
  onClose 
}) => {
  // fromDatacenter 는 데이터센터에서 바라보는 도메인, fromDomain 는 도메인에서 바라보는 데이터센터
  const title = sourceContext === "fromDomain" ? `${Localization.kr.DATA_CENTER}` : `${Localization.kr.DOMAIN}`;
  const label = sourceContext === "fromDomain"

  const onSuccess = () => {
    onClose();
    toast.success(`${title} 연결 완료`);
  };
  const { mutate: attachDomain } = useAttachDomain(onSuccess, () => onClose());

  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));

  const {
    data: domains = [],
    isLoading: isDomainsLoading,
    isError: isDomainsError,
    isSuccess: isDomainsSuccess,
  } = useAllStorageDomains((e) => ({ ...e }));

  const transformedDataCenterData = datacenters.map((dc) => ({
    ...dc,
    name: dc?.name,
    storageType: dc?.storageType ? "로컬" : "공유됨",
  }));

  const transformedDomainData = domains
    .filter((d) => d.dataCenterVo.id === "") // 데이터센터가 없는것만
    .map((domain) => ({
      ...domain,
      name: domain?.name,
      status: domain?.status,
      domainType:
        domain?.domainType === "data"
          ? "데이터"
          : domain?.domainType === "iso"
            ? "ISO" : "EXPORT",
      storageType:
        domain?.storageType === "nfs"
          ? "NFS"
          : domain?.storageType === "iscsi"
            ? "iSCSI" : "Fibre Channel",
      diskSize: checkZeroSizeToGiB(domain?.diskSize),
      availableSize: checkZeroSizeToGiB(domain?.availableSize),
    })
  );

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

    label 
      ? attachDomain({ storageDomainId: domainId, dataCenterId: selectedId })
      : attachDomain({ storageDomainId: selectedId, dataCenterId: datacenterId })
  };

  return (
    <BaseModal targetName={title} submitTitle={"연결"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "650px"}} 
    >
      <div>
        <TablesOuter
          isLoading={label ? isDataCentersLoading : isDomainsLoading}
          isError={label ? isDataCentersError : isDomainsError}
          isSuccess={label ? isDataCentersSuccess : isDomainsSuccess}
          columns={
            label
              ? TableColumnsInfo.STORAGE_DOMAINS_ATTACH_FROM_DATACENTER
              : TableColumnsInfo.DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN
          }
          data={label ? transformedDataCenterData : transformedDomainData}
          shouldHighlight1stCol={true}
          onRowClick={(row) => handleRowClick(row)}
        />
      </div>
      <span>id: {selectedId}</span>
    </BaseModal>
  );
};

export default DomainAttachModal;
