import "./InfoTable.css";

/**
 * @name InfoTable
 * 
 * @param {*} tableRows
 * @returns {JSX.Element} InfoTable
 */
const InfoTable = ({ 
  tableRows
}) => (
  <table className="info-table">
    <tbody>
      {tableRows.map((row, index) => (
        <InfoTableRow row={row} index={index} />
      ))}
    </tbody>
  </table>
);

const InfoTableRow = ({
  row,
  index,
}) => (
  <tr key={index}>
    <th className="fw-700">{row.label}</th>
    <td>{row.value}</td>
  </tr>
)

export default InfoTable;

