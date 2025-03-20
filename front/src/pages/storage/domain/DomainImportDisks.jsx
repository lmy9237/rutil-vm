import React, { useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainGetDiskModal from "../../../components/modal/domain/DomainGetDiskModal";
import { useAllUnregisteredDiskFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToGB } from "../../../util";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import ActionButton from "../../../components/button/ActionButton";

/**
 * @name DomainImportDisks
 * @description 도메인에 디스크 가져오기 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetDisks
 */
const DomainImportDisks = ({ domainId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllUnregisteredDiskFromDomain(domainId, (e) => ({ ...e }));

  const [activeModal, setActiveModal] = useState(null);
  const [selecteDisks, setSelectedDisks] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (Array.isArray(selecteDisks) ? selecteDisks : [])
    .map((disk) => disk.id)
    .join(", ");

  const transformedData = disks.map((disk) => ({
    ...disk,
    alias: disk?.alias,
    sparse: disk?.sparse ? "씬 프로비저닝" : "사전 할당",
    virtualSize: checkZeroSizeToGB(disk?.virtualSize),
    actualSize: checkZeroSizeToGB(disk?.actualSize),
    // ✅ 검색을 위한 text 필드 추가
    searchText: `${disk?.alias} ${disk?.sparse ? "씬 프로비저닝" : "사전 할당"} ${checkZeroSizeToGB(disk?.virtualSize)} ${checkZeroSizeToGB(disk?.actualSize)}`.toLowerCase(),
  }));
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  console.log(`disks: ${disks}`);
  return (
    <>
      <div className="dupl-header-group">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="header-right-btns">
          <ActionButton 
            label="가져오기" 
            actionType="default" 
            onClick={() => setActiveModal("get")}
            disabled={selecteDisks.length === 0} 
          />
          <ActionButton 
            label="삭제" 
            actionType="default" 
            onClick={() => setActiveModal("delete")}
          />
        </div>
      </div>
      
      <span>ID: {selectedIds || ""}</span>

      <TablesOuter
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
        columns={TableColumnsInfo.GET_DISKS}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        multiSelect={true}
      />

      {/* 모달 */}
      {activeModal === "get" && (
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

export default DomainImportDisks;
