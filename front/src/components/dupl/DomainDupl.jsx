import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import DomainActionButtons from "./DomainActionButtons";
import TablesOuter from "../table/TablesOuter";
import DomainModals from "../modal/domain/DomainModals";
import { renderDomainStatus, renderDomainStatusIcon } from "../Icon";
import { convertBytesToGB } from "../../util";

/**
 * @name DomainDupl
 * @description ...
 * 
 * @param {Array} domains,
 * @returns
 * 
 */
const DomainDupl = ({
  isLoading, isError, isSuccess,
  domains = [], columns = [], actionType = "domain", datacenterId,showSearchBox = false
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const selectedIds = (Array.isArray(selectedDomains) ? selectedDomains : [])
    .map((sd) => sd.id)
    .join(", ");

  const handleNameClick = (id) => navigate(`/storages/domains/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <DomainActionButtons
        openModal={openModal}
        isEditDisabled={selectedDomains.length !== 1}
        isDeleteDisabled={selectedDomains.length === 0}
        status={selectedDomains[0]?.status}
        actionType={actionType} // 도메인인지, 데이터센터인지
      />
      {/* <span style={{fontSize:"20px"}}>ID: {selectedIds || ""}</span> */}

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={domains.map((domain) => ({
          ...domain,
          icon: renderDomainStatusIcon(domain.status),
          status: renderDomainStatus(domain?.status),
          hostedEngine:
            domain?.hostedEngine === true ? (
              <FontAwesomeIcon
                icon={faPencil}
                fixedWidth
                style={{
                  color: "gold",
                  fontSize: "12px",
                  transform: "rotate(90deg)",
                }}
              />
            ) : (
              ""
            ),
          domainType:
            domain?.domainType === "data"
              ? "데이터"
              : domain?.domainType === "iso"
                ? "ISO"
                : "EXPORT",
          storageType:
            domain?.storageType === "nfs"
              ? "NFS"
              : domain?.storageType === "iscsi"
                ? "iSCSI"
                : "Fibre Channel",
          diskSize: convertBytesToGB(domain?.diskSize) + " GB",
          availableSize:
            convertBytesToGB(domain?.availableSize) + " GB",
          usedSize: convertBytesToGB(domain?.usedSize) + " GB",
        }))}
        shouldHighlight1stCol={true}
        showSearchBox={showSearchBox}
        onRowClick={(selectedRows) => setSelectedDomains(selectedRows)}
        clickableColumnIndex={[2]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <DomainActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
            actionType={actionType}
            isContextMenu={true}
          />,
        ]}
      />

      {/* 도메인 모달창 */}
      <DomainModals
        activeModal={activeModal}
        domain={selectedDomains[0]}
        selectedDomains={selectedDomains}
        datacenterId={datacenterId}
        onClose={closeModal}
      />
    </>
  );
};

export default DomainDupl;
