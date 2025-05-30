import React, { Suspense, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import useSearch               from "@/hooks/useSearch";
import SelectedIdView          from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink  from "@/components/common/OVirtWebAdminHyperlink";
import { ActionButton }        from "@/components/button/ActionButtons";
import SearchBox               from "@/components/button/SearchBox";
import TableColumnsInfo        from "@/components/table/TableColumnsInfo";
import TablesOuter             from "@/components/table/TablesOuter";
import {
  useAllUnregisteredDisksFromDomain
} from "@/api/RQHook";
import { checkZeroSizeToGiB }  from "@/util";
import Localization            from "@/utils/Localization";
import Loading from "@/components/common/Loading";
import DomainImportDiskModal from "@/components/modal/domain/DomainImportDiskModal";

/**
 * @name DomainImportDisks
 * @description 도메인에 디스크 가져오기 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainImportDisks
 */
const DomainImportDisks = ({ 
  domainId
}) => {
  const navigate = useNavigate()
  const {
    domainsSelected,
    disksSelected, setDisksSelected
  } = useGlobal()

  const [isImportPopup, setIsImportPopup] = useState(false);     

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useAllUnregisteredDisksFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...disks].map((disk) => ({
    ...disk,
    alias: disk?.alias,
    sparse: disk?.sparse ? "씬 프로비저닝" : "사전 할당",
    virtualSize: checkZeroSizeToGiB(disk?.virtualSize),
    actualSize: checkZeroSizeToGiB(disk?.actualSize),
    // ✅ 검색을 위한 text 필드 추가
    searchText: `${disk?.alias} ${disk?.sparse ? "씬 프로비저닝" : "사전 할당"} ${checkZeroSizeToGiB(disk?.virtualSize)} ${checkZeroSizeToGiB(disk?.actualSize)}`.toLowerCase(),
  })), [disks]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchDisks}/>
        <div className="header-right-btns">
          <ActionButton actionType="default" label={Localization.kr.IMPORT}
            disabled={disksSelected.length === 0} 
            onClick={() => setIsImportPopup(true)}
          />
          <ActionButton actionType="default" label={Localization.kr.REMOVE}
            disabled={disksSelected.length === 0} 
            onClick={() => ({})}
          />
        </div>
      </div>

      <TablesOuter target={"disk"}
        columns={TableColumnsInfo.GET_DISKS}
        data={filteredData}
        multiSelect={true}
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        shouldHighlight1stCol={true}
        isLoading={isDisksLoading} isRefetching={isDisksRefetching} isError={isDisksError} isSuccess={isDisksSuccess}
      />
      <SelectedIdView items={disksSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-disk_image_register;name=${domainsSelected[0]?.name}`}
      />
      <Suspense fallback={<Loading />}>
        <DomainImportDiskModal
          isOpen={isImportPopup}
          onClose={() => setIsImportPopup(false)}
          domainId={domainId}
          diskIds={disksSelected}
        />
      </Suspense>
    </>
  );
};

export default DomainImportDisks;
