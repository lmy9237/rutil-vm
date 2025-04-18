import React from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';
import Logger from '../../../../utils/Logger';

const DomainFibreImport = ({ 
  lunId, setLunId,
  hostVo, setHostVo,
  formImportState, setFormImportState,
  fcResults, setFcResults,
  refetchFc, isFcLoading, isFcError,isFcSuccess
}) => {  
  Logger.debug("DomainFibre ...")

  // const handleSearchFcp = () => {
  //   if (!hostVo.id) 
  //     return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
      
  //   importFcpFromHost({ hostId: hostVo.id }, {
  //     onSuccess: (data) => { setFcpSearchResults(data)},
  //     onError: (error) => { toast.error('fcp 가져오기 실패:', error)},
  //   });
  // };

  const handleRowClick = (row) => {
    const selectedRow = Array.isArray(row) ? row[0] : row;
    if (selectedRow && selectedRow.id) {
      Logger.debug('선택한 LUN ID:', selectedRow.id);
      setLunId(selectedRow.id);
    }
  }; 

  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        {isFcLoading ? (
          <div className="label-font-body">로딩 중...</div>
        ): (
          <Tables
            isLoading={isFcLoading} isError={isFcError} isSuccess={isFcSuccess}
            columns={TableColumnsInfo.IMPORT_FIBRE}
            data={fcResults}
            onRowClick={handleRowClick}
            shouldHighlight1stCol={true}
          />
        )} 
        <div> <span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibreImport;