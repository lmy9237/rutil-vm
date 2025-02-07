import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllVnicProfiles } from '../../api/RQHook';
import VnicProfileDupl from '../../pages/network/vnicProfile/VnicProfileDupl';

const VnicProfiles = () => {
  const { 
    data: vnicProfiles = []
  } = useAllVnicProfiles((e) => ({...e,}));

  return (
    <>
      <VnicProfileDupl
        columns={TableColumnsInfo.VNIC_PROFILES}
        vnicProfiles={vnicProfiles}
      />
    </>
  );
};

export default VnicProfiles;
