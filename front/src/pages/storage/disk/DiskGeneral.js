import { useDiskById } from "../../../api/RQHook";
import { formatBytesToGB, formatBytesToGBToFixedZero } from '../../../utils/format';

const DiskGeneral = ({ diskId }) => {
  const { data: disk } = useDiskById(diskId);

  const tableRows = [
    { label: "별칭", value: disk?.alias },
    { label: "ID", value: disk?.id },
    { label: "설명", value: disk?.description },
    { label: "디스크 프로파일", value: disk?.storageDomainVo?.name },
    { label: "가상 크기", value: formatBytesToGBToFixedZero(disk?.virtualSize) + ' GB' },
    { label: "실제 크기", value: formatBytesToGBToFixedZero(disk?.actualSize) + ' GB' },
  ];

  return (
    <div className="tables">
      <div className="table_container_center">
        <table className="table">
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <th>{row.label}:</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiskGeneral     