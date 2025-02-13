import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import { useNavigate } from "react-router-dom";

/**
 * @name ClusterTable
 * @description ...
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 *
 * @deprecated 사용안함
 */
const ClusterTable = ({ columns, clusters, setSelectedClusters }) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    navigate(`/computing/clusters/${id}`);
  };

  console.log("...");
  return (
    <>
      <TablesOuter
        columns={columns}
        data={clusters.map((cluster) => ({
          ...cluster,
          hostCnt: cluster?.hostSize?.allCnt,
          vmCnt: cluster?.vmSize.allCnt,
          dataCenter: (
            <TableRowClick type="datacenter" id={cluster.dataCenterVo.id}>
              {cluster.dataCenterVo.name}
            </TableRowClick>
          ),
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedClusters(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true} // 다중 선택 활성화
      />
    </>
  );
};

export default ClusterTable;
