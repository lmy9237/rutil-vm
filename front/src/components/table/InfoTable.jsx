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
  <div className="info-table-wrapper w-full">
    <table className="info-table w-full">
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
    <th className="fw-700">{row.label}</th>
    <td>{row.value}</td>
  </tr>
)

export default InfoTable;

