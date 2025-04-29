import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainGetDiskModal from "../../../components/modal/domain/DomainGetDiskModal";
import SearchBox from "../../../components/button/SearchBox";
import ActionButton from "../../../components/button/ActionButton";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { checkZeroSizeToGiB } from "../../../util";
import Logger from "../../../utils/Logger";
import { useAllUnregisteredDisksFromDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainImportDisks
 * @description 도메인에 디스크 가져오기 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetDisks
 */
const DomainImportDisks = ({ 
  domainId
}) => {
  const navigate = useNavigate()
  const { activeModal, setActiveModal, } = useUIState()
  const { domainsSelected, disksSelected, setDisksSelected } = useGlobal()

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
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
  const handleNameClick = useCallback((id) => {
    navigate(`/computing/templates/${id}`);
  }, [navigate])

  const handleRefresh = useCallback(() => {
    Logger.debug(`TemplateDupl > handleRefresh ... `)
    if (!refetchDisks) return;
    refetchDisks()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  // TODO: ActionButtons 생성
  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
        <div className="header-right-btns">
          <ActionButton actionType="default" label={Localization.kr.IMPORT}
            disabled={disksSelected.length === 0} 
            onClick={() => setActiveModal("domain:importDisk")}
          />
          <ActionButton actionType="default" label={Localization.kr.REMOVE}
            disabled={disksSelected.length === 0} 
            onClick={() => setActiveModal("disk:delete")}
          />
        </div>
      </div>

      <TablesOuter target={"disk"}
        columns={TableColumnsInfo.GET_DISKS}
        data={filteredData}
        multiSelect={true}
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        shouldHighlight1stCol={true}
        refetch={refetchDisks}
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
      />

      <SelectedIdView items={disksSelected} />
    </>
  );
};

export default DomainImportDisks;
