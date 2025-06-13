import React, { useCallback } from "react";
import { Tooltip } from "react-tooltip";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  useAllDisksFromTemplate,
  useStorageDomain,
} from "@/api/RQHook";
import { 
  checkZeroSizeToGiB,
  convertBytesToGB,
} from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

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
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useAllDisksFromTemplate(templateId, ((e) => ({...e})));
  
  const transformedData = [...disks].map((e) => {
    const disk = e?.diskImageVo;
    return {
      id: e?.id,
      interfaceType: e?.interface_ || Localization.kr.NOT_ASSOCIATED,
      _alias: (
        <TableRowClick type="disk" id={disk?.id}>
          {disk?.alias}
        </TableRowClick>
      ),
      virtualSize: checkZeroSizeToGiB(disk?.virtualSize),
      actualSize: checkZeroSizeToGiB(disk?.actualSize),
      creationTime: disk?.createDate || Localization.kr.NOT_ASSOCIATED,
      storageDomainId: disk?.storageDomainVo?.id,
      storageDomainName: disk?.storageDomainVo ? (
        <StorageDomainWithTooltip domainId={disk.storageDomainVo.id} />
      ) : Localization.kr.NOT_ASSOCIATED,
      storageType: disk?.storageType || 'Unknown',
      status: disk?.status || 'Unknown',
      policy: disk?.sparse ? '씬 프로비저닝' : '사전 할당',
    };
  });

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchDisks}/>
        {/* <HostActionButtons actionType = "default"/> */}
      </div>
      <TablesOuter target={"disk"}
        columns={TableColumnsInfo.DISKS_FROM_TEMPLATE}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(rows) => setDisksSelected(rows)}
        isLoading={isDisksLoading} isRefetching={isDisksRefetching} isError={isDisksError} isSuccess={isDisksSuccess}
      />
      <SelectedIdView items={disksSelected} />
    </>
  );
};


const StorageDomainWithTooltip = ({ domainId }) => {
  const { data: storageDomain, isLoading } = useStorageDomain(domainId);
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

