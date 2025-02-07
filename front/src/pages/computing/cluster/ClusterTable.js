import React from 'react';
import { useNavigate } from 'react-router-dom';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';

const ClusterTable = ({ columns, clusters, setSelectedClusters }) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    navigate(`/computing/clusters/${id}`);
  };

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
