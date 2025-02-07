import React, { useEffect} from 'react';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import { adjustFontSize } from '../../../UIEvent';
import { useAllNetworks } from '../../../api/RQHook';
import './css/Network.css';
import NetworkDupl from './NetworkDupl';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import {faServer} from '@fortawesome/free-solid-svg-icons'

const AllNetwork = () => {
  const { 
    data: networks = [], isLoading: isNetworksLoading,
  } = useAllNetworks((e) => ({...e}));

  useEffect(() => {
    window.addEventListener('resize', adjustFontSize);
    adjustFontSize();
    return () => { window.removeEventListener('resize', adjustFontSize); };
  }, []);

  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faServer}
          title="네트워크"
        />
      </div>
      <div className="host-btn-outer">
        <NetworkDupl
          columns={TableColumnsInfo.NETWORKS}
          networks={networks}
        />
      </div>
      <Footer/>
    </div>
  );
};

export default AllNetwork;
