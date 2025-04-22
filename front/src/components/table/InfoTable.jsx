import "./InfoTable.css";

const InfoTable = ({ 
  tableRows
}) => (
  <div className="info-table-outer">
    <table className="table">
      <tbody>
        {tableRows.map((row, index) => (
          <InfoTableRow row={row} index={index} />
        ))}
      </tbody>
    </table>
  </div>
);

const InfoTableRow = ({
  row,
  index,
}) => (
  <tr key={index}>
    <th>{row.label}</th>
    <td>{row.value}</td>
  </tr>
)

export default InfoTable;

