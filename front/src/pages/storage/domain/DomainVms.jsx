import React from 'react';
import Loading from '../../../components/common/Loading';
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useAllVMsFromDomain } from '../../../api/RQHook';
import { checkZeroSizeToGiB } from '../../../util';
import TableRowClick from '../../../components/table/TableRowClick';
import { useNavigate } from 'react-router-dom';
import Logger from '../../../utils/Logger';

/**
 * @name DomainVms
 * @description 도메인에 종속 된 VM정보
 * 
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainVms
 * 
 * @see DomainGetVms
 */
const DomainVms = ({ domainId }) => {
  const navigate = useNavigate();

  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllVMsFromDomain(domainId, (e) => ({ ...e, }));

  const transformedData = vms.map((vm) => ({
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
    virtualSize: checkZeroSizeToGiB(vm?.memoryGuaranteed),
    actualSize: checkZeroSizeToGiB(vm?.memorySize),
    disk: (
      <span 
        onClick={() => navigate(`/computing/vms/${vm?.id}/disks`)} 
        style={{ color: 'rgb(9, 83, 153)' }}
      > {vm?.diskAttachmentVos?.length} 
      </span>
    ),
    snapshot: (
      <span 
        onClick={() => navigate(`/computing/vms/${vm?.id}/snapshots`)} 
        style={{ color: 'rgb(9, 83, 153)' }}
      > {vm?.snapshotVos?.length} 
      </span>
    ),
    creationTime: vm?.creationTime
  }));

  if (isVmsLoading)
    return (<Loading />);
  
  if (isVmsError)
    return (<div>Error loading VMs data.</div>);

  Logger.debug("DomainVms ...")
  return (
    <>
      <TablesOuter columns={TableColumnsInfo.VMS_FROM_STORAGE_DOMAIN}
        data={transformedData}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
    </>
    
  );
};

export default DomainVms;
