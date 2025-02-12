import React from 'react';
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import Footer from '../../../components/footer/Footer';
import HeaderButton from '../../../components/button/HeaderButton';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useAllDisks } from '../../../api/RQHook';
import DiskDupl from './DiskDupl';

const AllDisk = () => {
  const { 
    data: disks = [], isLoading
} = useAllDisks((e) => ({...e,}));

  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faDatabase}
          title="디스크"
        />
        </div>
        <div className="host-btn-outer">
          <DiskDupl
            columns={TableColumnsInfo.DISKS}
            disks={disks}          
          />
        </div>
        <Footer/>
      </div>
  );
};

export default AllDisk;
