import React, { Suspense, useState } from 'react'; 
import { useAllDataCenterFromDomain, useDomainById } from "../../../api/RQHook";
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainActionButtons from './button/DomainActionButtons';
import { renderDataCenterStatusIcon } from '../../../utils/Icon';

const DomainActionModal = React.lazy(() => import('./modal/DomainActionModal'));
const DomainAttachModal = React.lazy(()=> import('./modal/DomainAttachModal'));

const DomainDatacenters = ({ domainId }) => {
  const { data: datacenters = [], isLoading: isDatacentersLoading } = useAllDataCenterFromDomain(domainId, (e) => ({...e,}));  
  const { data: domain } = useDomainById(domainId);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedDataCenters) ? selectedDataCenters : []).map((dc) => dc.id).join(', ');
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const renderModals = () => (
    <Suspense fallback={<div>Loading...</div>}>
      {activeModal === 'attach' ? (
        <DomainAttachModal
          isOpen={true}
          data={domain}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={closeModal}
        />
      ): (
        <DomainActionModal
          isOpen={['detach', 'activate', 'maintenance'].includes(activeModal)}
          action={activeModal} // `type` 전달
          data={domain}
          datacenterId={selectedDataCenters[0]?.id}
          onClose={closeModal}
        />
      )}      
    </Suspense>
  );

  return (
    <>
      <DomainActionButtons
        openModal={openModal}
        isEditDisabled={selectedDataCenters.length !== 1}
        isDeleteDisabled={selectedDataCenters.length === 0} 
        status={selectedDataCenters[0]?.domainStatus}
        actionType="domainDc" // 도메인인지, 데이터센터인지
      />
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter
        columns={TableColumnsInfo.DATACENTERS_FROM_STORAGE_DOMAIN}
        data={datacenters.map((datacenter) => ({
          ...datacenter,
          icon: renderDataCenterStatusIcon(datacenter?.domainStatus),
          name: <TableRowClick type="datacenter" id={datacenter?.id}>{datacenter?.name}</TableRowClick>,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDataCenters(selectedRows)}
      />

      {/* 도메인 모달창 */}
      { renderModals() }
    </>
  );
};
  
export default DomainDatacenters;