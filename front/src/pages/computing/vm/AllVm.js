import React from 'react';
import HeaderButton from '../../../components/button/HeaderButton';
import './css/Vm.css';
import Footer from '../../../components/footer/Footer';
import {useAllVMs } from '../../../api/RQHook';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmDupl from './VmDupl';

const AllVm = () => {
  const { 
    data: vms = [], isLoading: isVmsLoading 
  } = useAllVMs((e) => ({...e,}));

  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faDesktop}
          title="가상머신"
        />
      </div>
      <div className="host-btn-outer">
        <VmDupl
          columns={TableColumnsInfo.VMS}
          vms={vms}
        />    
      </div>
      <Footer/>
    </div>
  );
};

export default AllVm;
