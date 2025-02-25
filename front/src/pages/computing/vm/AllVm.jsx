import React from 'react';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import HeaderButton from '../../../components/button/HeaderButton';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmDupl from '../../../components/dupl/VmDupl';
import { useAllVMs } from '../../../api/RQHook';
import './Vm.css';

/**
 * @name AllVm
 * @description 가상머신
 *
 * @returns
 */
const AllVm = () => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: vmsRefetch,
  } = useAllVMs((e) => ({ ...e, }));

console.log("...")
  return (
    <div id="section">
      <HeaderButton
        titleIcon={faDesktop}
        title="가상머신"
      />
      <div className="w-full px-[0.5rem] py-[0.5rem] section-content">
        <VmDupl
          isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
          columns={TableColumnsInfo.VMS}
          vms={vms}
          onCloseModal={vmsRefetch}
        />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AllVm;
