import React from 'react';
import { useDomainById } from '../../../api/RQHook';
import { formatBytesToGBToFixedZero, zeroValue } from '../../../utils/format';

const DomainGeneral = ({ domainId }) => {
  const { data: domain } = useDomainById(domainId);

  function overCommit(commit, disk) {
    return ((commit / disk) * 100).toFixed(0);
  }

  const tableRows = [
    { label: "ID", value: domain?.id },
    { label: "크기", value: zeroValue(formatBytesToGBToFixedZero(domain?.diskSize)) },
    { label: "사용 가능", value: zeroValue(formatBytesToGBToFixedZero(domain?.availableSize)) },
    { label: "사용됨", value: zeroValue(formatBytesToGBToFixedZero(domain?.usedSize)) },
    { label: "할당됨", value: zeroValue(formatBytesToGBToFixedZero(domain?.commitedSize)) },
    { label: "오버 할당 비율", value: overCommit(domain?.availableSize, domain?.diskSize) },
    { label: "이미지: (약간의 문제)", value: domain?.diskImageVos?.length || 0 },
    { label: "경로", value: domain?.storageAddress }, // nfs 일때만
    { label: "NFS 버전", value: domain?.nfsVersion },
    // { label: "디스크 공간 부족 경고 표시", value: {domain?.warning}% ({(formatBytesToGBToFixedZero(domain?.diskSize) / domain?.warning).toFixed(0)} GB) },
    { label: "심각히 부족한 디스크 공간의 동작 차단", value: domain?.spaceBlocker },
  ];

  return (
      <div>
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
    );
  };
  
  export default DomainGeneral;