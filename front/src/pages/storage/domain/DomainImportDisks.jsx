import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
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
import useGlobal from "../../../hooks/useGlobal";

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
  const { disksSelected, setDisksSelected } = useGlobal()

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useAllUnregisteredDisksFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = [...disks].map((disk) => ({
    ...disk,
    alias: disk?.alias,
    sparse: disk?.sparse ? "씬 프로비저닝" : "사전 할당",
    virtualSize: checkZeroSizeToGiB(disk?.virtualSize),
    actualSize: checkZeroSizeToGiB(disk?.actualSize),
    // ✅ 검색을 위한 text 필드 추가
    searchText: `${disk?.alias} ${disk?.sparse ? "씬 프로비저닝" : "사전 할당"} ${checkZeroSizeToGiB(disk?.virtualSize)} ${checkZeroSizeToGiB(disk?.actualSize)}`.toLowerCase(),
  }));
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

  Logger.debug(`DomainImportDisks ... transformedData: ${transformedData}`);
  return (
    <>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={handleRefresh}/>
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            onClick={() => setActiveModal("domain:importDisk")}
            disabled={disksSelected.length === 0} 
          />
          <ActionButton label={Localization.kr.REMOVE}
            actionType="default" 
            onClick={() => setActiveModal("disk:delete")}
            disabled={disksSelected.length === 0} 
          />
        </div>
      </div>
      <TablesOuter
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
        columns={TableColumnsInfo.GET_DISKS}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        multiSelect={true}
        /*
        onContextMenuItems={(row) => [
          <>
          <ActionButton label={Localization.kr.IMPORT}
            actionType="default" 
            onClick={() => setActiveModal("get")}
            disabled={selectedDisks.length === 0} 
          />
          <ActionButton label={Localization.kr.REMOVE}
            actionType="default" 
            onClick={() => setActiveModal("delete")}
          />
          </>
        ]}
        */
      />

      <SelectedIdView items={disksSelected} />

      {/* 모달 */}
      {activeModal() === "domain:importDisk" && (
        <DomainGetDiskModal isOpen={activeModal() === "domain:importDisk"}
          domainId={domainId}
          data={disksSelected}
          onClose={() => setActiveModal(null)}
        />
      )}
      {/* {activeModal() === 'delete' && (
        <DeleteModal
          isOpen={true}
          onClose={() => setActiveModal(null)} 
          label={"등록되지 않은 디스크"}
          data={selectedDisks}
          api={useDeleteDisk()}
        />
      )} */}
    </>
  );
};

export default DomainImportDisks;
