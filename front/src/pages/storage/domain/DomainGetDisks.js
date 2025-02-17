import React, { useState } from 'react'; 
import TablesOuter from '../../../components/table/TablesOuter';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainGetDiskModal from '../../../components/modal/domain/DomainGetDiskModal';
import { useAllUnregisteredDiskFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToGB } from '../../../util';

const DomainGetDisks = ({ domainId }) => {
  const { 
    data: disks = [], 
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllUnregisteredDiskFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selecteDisks, setSelectedDisks] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selecteDisks) ? selecteDisks : []).map((disk) => disk.id).join(', ');

  console.log("disks:" + disks)
  return (
    <>
      <div className="header-right-btns">
        <button onClick={() => setActiveModal('get')} disabled={selecteDisks.length === 0}>가져오기</button>
        <button onClick={() => setActiveModal('delete')}>삭제</button>
      </div>
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter 
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
        columns={TableColumnsInfo.GET_DISKS}
        data={disks.map((disk) => ({
            ...disk,
            alias: disk?.alias,
            sparse: disk?.sparse ? '씬 프로비저닝' : '사전 할당',            
            virtualSize: checkZeroSizeToGB(disk?.virtualSize),
            actualSize: checkZeroSizeToGB(disk?.actualSize),
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        multiSelect={true}
      />
    
      {/* 모달 */}
      {activeModal === 'get' && (
        <DomainGetDiskModal 
          isOpen={true} 
          domainId={domainId}
          data={selecteDisks} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {/* {activeModal === 'delete' && (
        <DeleteModal
          isOpen={true}
          onClose={() => setActiveModal(null)} 
          label={"등록되지 않은 디스크"}
          data={selecteDisks}
          api={useDeleteDisk()}
        />
      )} */}
    </>
  );
};

export default DomainGetDisks;
