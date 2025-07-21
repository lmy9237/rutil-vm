import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import Localization from "../../../utils/Localization";
import useGlobal from "../../../hooks/useGlobal";
import SelectedIdView from "../../common/SelectedIdView";
import { checkZeroSizeToGiB } from "../../../util";
import { useAllDataCenters, useAllStorageDomains, useAttachDomain } from "../../../api/RQHook";
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
  onClose,
}) => {
  // const { closeModal } = useUIState()
  const {
    datacentersSelected, setDatacentersSelected, 
    domainsSelected, setDomainsSelected,
    sourceContext
  } = useGlobal()

  // fromDatacenter 는 데이터센터에서 바라보는 도메인, fromDomain 는 도메인에서 바라보는 데이터센터
  const title = sourceContext === "fromDomain" 
    ? `${Localization.kr.DATA_CENTER}` 
    : `${Localization.kr.DOMAIN}`;
  const label = sourceContext === "fromDomain"
  
  const {
    data: domains = [],
    isLoading: isDomainsLoading,
    isError: isDomainsError,
    isSuccess: isDomainsSuccess,
  } = useAllStorageDomains((e) => ({ ...e }));
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));

  const {
    mutate: attachDomain 
  } = useAttachDomain(onClose, onClose);

  const transformedDataCenterData = [...datacenters].map((dc) => ({
    ...dc,
    name: dc?.name,
    storageType: dc?.storageType ? "로컬" : "공유됨",
  }));

  const transformedDomainData = [...domains]
    .filter((d) => d?.dataCenterVo?.id === "") // 데이터센터가 없는것만
    .map((domain) => ({
      ...domain,
      name: domain?.name,
      status: domain?.status,
      storageDomainType: domain?.storageDomainTypeKr || (
        domain?.storageDomainType === "master"
          ? `데이터 (마스터)`
          : domain?.storageDomainType === "data"
            ? "데이터"
            : domain?.storageDomainType === "import_export"
              ? `내보내기`
              : domain?.storageDomainType === "iso"
                ? "ISO" 
                : "EXPORT"
      ),
      storageType:
        domain?.storageType === "nfs"
          ? "NFS"
          : domain?.storageType === "iscsi"
            ? "iSCSI" : "Fibre Channel",
      diskSize: checkZeroSizeToGiB(domain?.diskSize),
      availableSize: checkZeroSizeToGiB(domain?.availableSize),
    })
  );

  const handleFormSubmit = () => {
    Logger.debug(`DomainAttachModal > handleFormSubmit ... `)
    attachDomain(
      { dataCenterId: datacentersSelected[0]?.id, storageDomainId: domainsSelected[0]?.id }
    )
  };

  return (
    <BaseModal targetName={title} submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      isReady={
        label 
          ? isDataCentersSuccess
          : isDomainsSuccess
      }
      contentStyle={{ width: "650px"}} 
    >
      <div className="py-4">
        <TablesOuter target={"domain"}
          isLoading={label ? isDataCentersLoading : isDomainsLoading}
          isError={label ? isDataCentersError : isDomainsError}
          isSuccess={label ? isDataCentersSuccess : isDomainsSuccess}
          columns={label
            ? TableColumnsInfo.STORAGE_DOMAINS_ATTACH_FROM_DATACENTER
            : TableColumnsInfo.DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN
          }
          data={label ? transformedDataCenterData : transformedDomainData}
          shouldHighlight1stCol={true}
          onRowClick={label 
            ? (row) => setDatacentersSelected(row)
            : (row) => setDomainsSelected(row)
          }
        />
        <SelectedIdView items={label ? datacentersSelected: domainsSelected} />
      </div>
  
    </BaseModal>
  );
};

export default DomainAttachModal;
