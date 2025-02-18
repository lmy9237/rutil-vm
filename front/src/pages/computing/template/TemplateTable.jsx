import React from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { useNavigate } from 'react-router-dom';

/**
 * @name TemplateTable
 * @description 탬플릿 테이블
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateTable
 */
const TemplateTable = ({
  columns,
  templates,
  setSelectedTemplates,
}) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    navigate(`/computing/templates/${id}`);
  };

  const handleRowSelection = (selectedRows) => {
    setSelectedTemplates(selectedRows);
  };

  return (
    <TablesOuter
      columns={columns}
      data={templates.map((temp) => ({
        ...temp,
        cluster: (
          <TableRowClick type="cluster" id={temp.clusterVo.id}>
            {temp?.clusterVo?.name}
          </TableRowClick>
        ),
        dataCenter: (
          <TableRowClick type="datacenter" id={temp.dataCenterVo.id}>
            {temp?.dataCenterVo?.name}
          </TableRowClick>
        ),
      }))}
      shouldHighlight1stCol={true}
      onRowClick={handleRowSelection}
      clickableColumnIndex={[0]}
      onClickableColumnClick={(row) => handleNameClick(row.id)}
    />
  );
};

export default TemplateTable;
