import React from 'react';
import Modal from 'react-modal';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import {useAllVnicProfiles } from '../../../api/RQHook';
import {  faLaptop } from '@fortawesome/free-solid-svg-icons'; 
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VnicProfileDupl from './VnicProfileDupl';

// React Modal 설정
Modal.setAppElement('#root');

const AllVnic = () => {
  const { 
    data: vnicProfiles = [], isLoading: isVnicProfilesLoading,
  } = useAllVnicProfiles((e) => ({...e,}));


  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faLaptop}
          title="VNIC 프로파일"
        />
      </div>
      <div className="host-btn-outer">
        <VnicProfileDupl
          columns={TableColumnsInfo.VNIC_PROFILES}
          vnicProfiles={vnicProfiles || []}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default AllVnic;
