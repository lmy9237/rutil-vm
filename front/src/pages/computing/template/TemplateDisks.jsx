import React from "react";
import { Tooltip } from "react-tooltip";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
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
} from "@/util";
import Localization           from "@/utils/Localization";

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
  const { disksSelected, setDisksSelected } = useGlobal()
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useAllDisksFromTemplate(templateId, ((e) => ({...e})));
  
  const transformedData = [...disks]
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .map((e) => {
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
              크기: {checkZeroSizeToGiB(storageDomain?.size)}<br/>
              사용 가능: {checkZeroSizeToGiB(storageDomain?.availableSize)}<br/>
              사용됨: {checkZeroSizeToGiB(storageDomain?.usedSize)}
            </>
        }
      </Tooltip>
    </>
  );
};

export default TemplateDisks;

