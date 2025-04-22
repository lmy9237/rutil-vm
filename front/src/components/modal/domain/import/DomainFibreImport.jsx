import React, { useState } from 'react';
import TableColumnsInfo from '../../../table/TableColumnsInfo';
import Tables from '../../../table/Tables';
import Logger from '../../../../utils/Logger';
import toast from 'react-hot-toast';
import Localization from '../../../../utils/Localization';

const DomainFibreImport = ({ 
  fcResults, setFcResults,
  lunId, setLunId,
  hostVo, setHostVo,
  importFcpFromHostAPI
}) => {  
  const [isFcpLoading, setIsFcpLoading] = useState(false);
  const [isFcpError, setIsFcpsError] = useState(false);
  const [isFcpSuccess, setIsFcpSuccess] = useState(false);

  const transFcData = [...fcResults]?.map((i) => ({
    ...i,
    id: i?.id,
    name: i?.name,
  }));

  const handleSearchFcp = () => {
    if (!hostVo.id) return toast.error(`${Localization.kr.HOST}를 선택해주세요.`);
    setIsFcpLoading(true);

    importFcpFromHostAPI(
      { hostId: hostVo?.id },
      { 
        onSuccess: (data) => {
          setFcResults(data);
          setIsFcpLoading(false);
          setIsFcpSuccess(true);
          setIsFcpsError(false);
        },
        onError: (error) => {
          toast.error("iSCSI 가져오기 실패 ", error);
          setIsFcpLoading(false);
          setIsFcpSuccess(false);
          setIsFcpsError(true);
        },
      }
    );
  };

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
        
            <div className="target-btn">
              <button className="all-login-button" onClick={handleSearchFcp}>로그인</button>
            </div>
            <Tables
              isLoading={isFcpLoading} isError={isFcpError} isSuccess={isFcpSuccess}
              columns={TableColumnsInfo.IMPORT_FIBRE}
              data={transFcData}
              onRowClick={handleRowClick}
              shouldHighlight1stCol={true}
            />
        <div> <span style={{ fontSize: '22px' }}>id: {lunId}</span> </div>
      </div>
    </div>
  )
};

export default DomainFibreImport;