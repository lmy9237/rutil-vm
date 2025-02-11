import React, { useState } from 'react';
import { faDesktop, faHdd, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../../components/common/Loading';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useAllVMFromDomain } from '../../../api/RQHook';
import { checkZeroSizeToGB } from '../../../util';

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
        <FontAwesomeIcon icon={isExpanded ? faMinusCircle : faPlusCircle} fixedWidth />
        <FontAwesomeIcon icon={faDesktop} style={{ margin: '0 5px 0 10px' }} fixedWidth />
        {vm?.name || ''}
      </td>
      <td>{vm?.diskAttachments?.length}</td>
      <td>{vm?.virtualSize}</td>
      <td>{vm?.actualSize}</td>
      <td>{vm?.creationTime || ''}</td>
    </tr>
    {isExpanded &&
      vm.diskAttachments?.map((disk, index) => (
        <DiskRow key={`${vm.id}-${index}`} disk={disk} />
      ))}
  </>
);

const DiskRow = ({ disk }) => (
  <tr className="detail-machine-second">
    <td style={{ paddingLeft: '30px' }}>
      <FontAwesomeIcon icon={faHdd} fixedWidth style={{ margin: '0 5px' }} />
      {disk.diskImageVo?.alias || ''}
    </td>
    <td></td>
    <td>{checkZeroSizeToGB(disk.diskImageVo?.virtualSize)}</td>
    <td>{checkZeroSizeToGB(disk.diskImageVo?.actualSize)}</td>
    <td>{disk.diskImageVo?.createDate || ''}</td>
  </tr>
);

/**
 * @name DomainVms
 * @description 도메인에 종속 된 VM정보
 * 
 * @param {string} domainId 도메인ID
 * @returns 
 * 
 * @see DomainGetVms
 */
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
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllVMFromDomain(domainId, (vm) => {
    const totalVirtualSize = calculateTotalVirtualSize(vm?.diskAttachmentVos || []);
    const totalActualSize = calculateTotalActualSize(vm?.diskAttachmentVos || []);
    return {
      ...vm,
      virtualSize: checkZeroSizeToGB(totalVirtualSize),
      actualSize: checkZeroSizeToGB(totalActualSize),
      diskAttachments: vm?.diskAttachmentVos || [],
    };
  });

  if (isVmsLoading)
    return (<Loading />);
  
  if (isVmsError)
    return (<div>Error loading VMs data.</div>);

  console.log("...")
  return (
    <>
      <TablesOuter
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS_FROM_STORAGE_DOMAIN}
        data={vms}
      />
      {/*<div className="host-empty-outer">
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
    </div>*/}
    </>
    
  );
};

export default DomainVms;
