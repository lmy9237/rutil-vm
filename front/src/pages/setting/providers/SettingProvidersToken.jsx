import React, { useMemo, useState } from "react";
import SearchBox from "@/components/button/SearchBox";
import TableColumnsInfo from "@/components/table/TableColumnsInfo";
import TablesOuter from "@/components/table/TablesOuter";

const SettingProvidersToken = () => {
  // 상태 초기화
  const [searchQuery, setSearchQuery] = useState("");
  const [vmsSelected, setVmsSelected] = useState([]);

  // 샘플 데이터
  const mockData = useMemo(() => [
    {
      uuid: "123e4567-e89b-12d3-a456-426614174001",
      type: "OAuth Token",
      description: "Provider access token for system A",
      createdAt: "2025-07-01 10:00:00",
    },
  ], []);

  const filteredData = mockData.filter(
    (item) =>
      item.uuid.includes(searchQuery) ||
      item.type.includes(searchQuery) ||
      item.description.includes(searchQuery)
  );

  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <TablesOuter
        target="vm"
        columns={TableColumnsInfo.SETTING_PROVIDER_TOKEN}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        isLoading={false}
        isRefetching={false}
        isError={false}
        isSuccess={true}
      />
   
    </>
  );
};

export default SettingProvidersToken;
