import React, { useState } from 'react';
import { faDesktop, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAllVMFromDomain } from '../../../api/RQHook';

const sizeToGB = (data) => (data / Math.pow(1024, 3));
const formatSize = (size) => (sizeToGB(size) < 1 ? '< 1 GB' : `${sizeToGB(size).toFixed(0)} GB`);

const calculateTotalVirtualSize = (diskAttachments) => {
  return diskAttachments.reduce((total, disk) => total + (disk.diskImageVo?.virtualSize || 0), 0);
};

const calculateTotalActualSize = (diskAttachments) => {
  return diskAttachments.reduce((total, disk) => total + (disk.diskImageVo?.actualSize || 0), 0);
};

const VMRow = ({ vm, isExpanded, toggleRow }) => (
  <>
    <tr>
      <td onClick={() => toggleRow(vm?.id)} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={isExpanded ? faMinusCircle : faPlusCircle} fixedWidth/>
        <FontAwesomeIcon icon={faDesktop} style={{ margin: '0 5px 0 10px' }} fixedWidth/>
        {vm?.name || ''}
      </td>
      <td>{vm?.diskAttachments?.length || 0}</td>
      <td>{vm?.virtualSize || 0}</td>
      <td>{vm?.actualSize || 0}</td>
      <td>{vm?.creationTime || ''}</td>
    </tr>
    {isExpanded &&
      vm.diskAttachments?.map((disk, index) => (
        <DiskRow key={`${vm.id}-${index}`} disk={disk} />
      ))}
  </>
);

const DiskRow = ({ disk }) => (
  <tr className="detail_machine_second">
    <td style={{ paddingLeft: '30px' }}>
      <FontAwesomeIcon icon={faDesktop} fixedWidth style={{ margin: '0 5px' }} />
      {disk.diskImageVo?.alias || ''}
    </td>
    <td></td>
    <td>{formatSize(disk.diskImageVo?.virtualSize || 0)}</td>
    <td>{formatSize(disk.diskImageVo?.actualSize || 0)}</td>
    <td>{disk.diskImageVo?.createDate || ''}</td>
  </tr>
);

const DomainVms = ({ domainId }) => {
  const [isRowExpanded, setRowExpanded] = useState({});

  const toggleRow = (id) => {
    setRowExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const {
    data: vms = [],
    isLoading,
    isError,
  } = useAllVMFromDomain(domainId, (vm) => {
    const totalVirtualSize = calculateTotalVirtualSize(vm?.diskAttachmentVos || []);
    const totalActualSize = calculateTotalActualSize(vm?.diskAttachmentVos || []);
    return {
      ...vm,
      virtualSize: formatSize(totalVirtualSize),
      actualSize: formatSize(totalActualSize),
      diskAttachments: vm?.diskAttachmentVos || [],
    };
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading VMs data.</div>;

  return (
    <div className="host-empty-outer">
      <div className="section-table-outer">
        <table>
          <thead>
            <tr>
              <th>별칭</th>
              <th>디스크</th>
              <th>가상 크기</th>
              <th>실제 크기</th>
              <th>생성 일자</th>
            </tr>
          </thead>
          <tbody>
            {vms.length === 0 ? (
              <>
              <tr>
                <td colSpan={'5'}>없음</td>
              </tr>
              </>
            ) : (vms.map((vm) => (
              <VMRow
                key={vm.id}
                vm={vm}
                isExpanded={isRowExpanded[vm.id]}
                toggleRow={toggleRow}
              />
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainVms;
