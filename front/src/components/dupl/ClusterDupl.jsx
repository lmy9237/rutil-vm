import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import ClusterModals from "../modal/cluster/ClusterModals";
import ClusterActionButtons from "./ClusterActionButtons";

/**
 * @name ClusterDupl
 * @description ...
 * 
 * @param {Array} clusters
 * @param {string[]} columns
 * @param {string} datacenterId
 * 
 * @returns
 */
const ClusterDupl = ({
  isLoading, isError, isSuccess,
  clusters = [], columns = [], datacenterId,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const selectedIds = (Array.isArray(selectedClusters) ? selectedClusters : []).map((cluster) => cluster.id).join(", ");

  const handleNameClick = (id) => navigate(`/computing/clusters/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const status = 
      selectedClusters.length === 0 ? "none"
      : selectedClusters.length === 1 ? "single"
      : "multiple";

  return (
    <>
      <ClusterActionButtons
        openModal={openModal}
        isEditDisabled={selectedClusters.length !== 1}
        status={status}
      />
      {/* <span style={{fontSize:"16px"}}>ID: {selectedIds}</span> */}

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={clusters.map((cluster) => ({
          ...cluster,
          hostCnt: cluster?.hostSize?.allCnt,
          vmCnt: cluster?.vmSize?.allCnt,
          dataCenter: (
            <TableRowClick type="datacenter" id={cluster?.dataCenterVo?.id}>
              {cluster?.dataCenterVo?.name}
            </TableRowClick>
          ),
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedClusters(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true} // 다중 선택 활성화
        onContextMenuItems={(row) => [
          <ClusterActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
          />,
        ]}
      />

      {/* 클러스터 모달창 */}
      <ClusterModals
        activeModal={activeModal}
        cluster={selectedClusters[0]}
        selectedClusters={selectedClusters}
        datacenterId={datacenterId}
        onClose={closeModal}
      />
    </>
  );
};

export default ClusterDupl;
