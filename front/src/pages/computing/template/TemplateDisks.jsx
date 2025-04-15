import React, { useState } from 'react';
import TableRowClick from '../../../components/table/TableRowClick';
import { useAllDisksFromTemplate, useStroageDomain } from '../../../api/RQHook';
import { checkZeroSizeToGiB, convertBytesToGB } from '../../../util';
import { Tooltip } from 'react-tooltip';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import TablesOuter from '../../../components/table/TablesOuter';
import SelectedIdView from '../../../components/common/SelectedIdView';
import useGlobal from '../../../hooks/useGlobal';
import useUIState from '../../../hooks/useUIState';
import Logger from '../../../utils/Logger';

/**
 * @name TemplateDisks
 * @description 탬플릿에 종속 된 디스크 목록
 *
 * @prop {string} templateId 탬플릿 ID
 * @returns {JSX.Element} TemplateDisks
 */
const TemplateDisks = ({
  templateId 
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { disksSelected, setDisksSelected } = useGlobal()
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDisksFromTemplate(templateId, ((e) => ({...e})));
  
  const transformedData = (!Array.isArray(disks) ? [] : disks).map((e) => {
    const disk = e?.diskImageVo;
    return {
      id: e?.id,
      interfaceType: e?.interface_ || 'N/A',
      _alias: (
        <TableRowClick type="disk" id={disk?.id}>
          {disk?.alias}
        </TableRowClick>
      ),
      virtualSize: checkZeroSizeToGiB(disk?.virtualSize),
      actualSize: checkZeroSizeToGiB(disk?.actualSize),
      creationTime: disk?.createDate || 'N/A',
      storageDomainId: disk?.storageDomainVo?.id,
      storageDomainName: disk?.storageDomainVo ? (
        <StorageDomainWithTooltip domainId={disk.storageDomainVo.id} />
      ) : 'N/A',
      storageType: disk?.storageType || 'Unknown',
      status: disk?.status || 'Unknown',
      policy: disk?.sparse ? '씬 프로비저닝' : '사전 할당',
    };
  });

  Logger.debug(`TemplateDisks ... `)
  return (
    <>
      <TablesOuter columns={TableColumnsInfo.DISKS_FROM_TEMPLATE}
        data={transformedData}
        onRowClick={(rows) => setDisksSelected(rows)}
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
      />

      <SelectedIdView items={disksSelected} />
    </>
  );
};


const StorageDomainWithTooltip = ({ domainId }) => {
  const { data: storageDomain, isLoading } = useStroageDomain(domainId);
  return (
    <>
      <span data-tooltip-id={`storage-domain-tooltip-${domainId}`}>
        <TableRowClick type="domain" id={domainId}>
          {storageDomain?.name || '불러오는 중...'}
        </TableRowClick>
      </span>
      <Tooltip id={`storage-domain-tooltip-${domainId}`} place="top" effect="solid">
        {isLoading
          ? '로딩 중...'
          : <>
              {/* {storageDomain?.name || '정보 없음'}<br /> */}
              크기: {checkZeroSizeToGiB(storageDomain?.diskSize)}<br />
              사용 가능: {checkZeroSizeToGiB(storageDomain?.availableSize)}<br />
              사용됨: {checkZeroSizeToGiB(storageDomain?.usedSize)}<br />
            </>
        }
      </Tooltip>
    </>
  );
};

export default TemplateDisks;

