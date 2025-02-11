import React, { useState } from 'react'; 
import { useAllDataCenterFromDomain } from "../../../api/RQHook";
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainGetVmTemplateModal from '../../../components/modal/domain/DomainGetVmTemplateModal';
import DomainGetDiskModal from '../../../components/modal/domain/DomainGetDiskModal';
import DeleteModal from '../../../components/DeleteModal';

const DomainGetDisks = ({ domainId }) => {
  const { data: datacenters = [], isLoading: isDatacentersLoading } = useAllDataCenterFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selectedDataCenters) ? selectedDataCenters : []).map((dc) => dc.id).join(', ');

  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('get')}>가져오기</button>
        <button onClick={() => setActiveModal('delete')}>삭제</button>
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        columns={TableColumnsInfo.GET_DISKS} 
        shouldHighlight1stCol={true}
        onRowClick={{ console }}
        multiSelect={true}
      />
    
      {/* 모달 */}
      {activeModal === 'get' && (
        <DomainGetDiskModal 
          isOpen={true} 
          data={selectedDataCenters} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'delete' && (
        <DeleteModal
          isOpen={true}
          type="Vm" 
          onRequestClose={() => setActiveModal(null)} 
          contentLabel={'디스크'}
          data={selectedDataCenters}
        />
      )}
    </>
  );
};

export default DomainGetDisks;
