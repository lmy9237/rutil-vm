import React, { useState } from 'react'; 
import { useAllUnregisteredDiskFromDomain } from "../../../api/RQHook";
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainGetDiskModal from '../../../components/modal/domain/DomainGetDiskModal';
import DeleteModal from '../../../utils/DeleteModal';
import { formatBytesToGBToFixedZero } from '../../../util';

const DomainGetDisks = ({ domainId }) => {
  const { data: disks = [], isLoading: isDisksLoading } = useAllUnregisteredDiskFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selecteDisks, setSelectedDisks] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(setSelectedDisks) ? setSelectedDisks : []).map((disk) => disk.id).join(', ');

  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('get')}>가져오기</button>
        <button onClick={() => setActiveModal('delete')}>삭제</button>
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        columns={TableColumnsInfo.GET_DISKS}
        data={disks.map((d) => {
          return {
            ...d,
            alias: d?.alias,
            sparse: d?.sparse ? '씬 프로비저닝' : '사전 할당',            
            virtualSize: formatBytesToGBToFixedZero(d?.virtualSize) + " GiB",
            actualSize: formatBytesToGBToFixedZero(d?.actualSize),
          }
        })}
        shouldHighlight1stCol={true}
        onRowClick={{ console }}
        multiSelect={true}
      />
    
      {/* 모달 */}
      {activeModal === 'get' && (
        <DomainGetDiskModal 
          isOpen={true} 
          data={selecteDisks} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'delete' && (
        <DeleteModal
          isOpen={true}
          type="Vm" 
          onRequestClose={() => setActiveModal(null)} 
          contentLabel={'디스크'}
          data={selecteDisks}
        />
      )}
    </>
  );
};

export default DomainGetDisks;
