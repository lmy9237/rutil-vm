import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import VnicProfileActionButtons         from "./VnicProfileActionButtons";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import { RVI16, rvi16Lan2 } from "../icons/RutilVmIcons";

/**
 * @name VnicProfileDupl
 * @description vNIC 프로필 목록을 표시하는 컴포넌트 (검색 및 테이블 포함)
 *
 * @param {Array} vnicProfiles vNIC 프로필
 * @returns {JSX.Element}
 */
const VnicProfileDupl = ({
  vnicProfiles = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const {
    setDatacentersSelected,
    setNetworksSelected,
    vnicProfilesSelected, setVnicProfilesSelected
  } = useGlobal();

  // ✅ 데이터 변환 (검색 가능하도록 `searchText` 필드 추가)
  const transformedData = [...vnicProfiles].map((vnic) => ({
    ...vnic,
    _name: (
      <TableRowClick type="vnicProfile" id={vnic?.id}>
        {vnic?.name}
      </TableRowClick>
    ),
    network: (
      <TableRowClick type="network" id={vnic?.networkVo?.id}>
        {vnic?.networkVo?.name}
      </TableRowClick>
    ),
    dataCenter: (
      <TableRowClick type="datacenter" id={vnic?.dataCenterVo?.id}>
        {vnic?.dataCenterVo?.name}
      </TableRowClick>
    ),
    portMirroring: vnic?.portMirroring === true ? "O" : "",
    passThrough: vnic?.passThrough === "DISABLED" ? "아니요" : Localization.kr.YES,
    networkFilter: vnic?.networkFilterVo?.name || "-",
    searchText: `${vnic?.name} ${vnic?.networkVo?.name || ""} ${vnic?.dataCenterVo?.name || ""} ${vnic?.networkFilterVo?.name || ""}`
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/vnicProfiles/${id}/vms`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isLoading} isRefetching={isRefetching} refetch={refetch} 
        />
        <LoadingFetch isLoading={isLoading} isRefetching={isRefetching} />
        <VnicProfileActionButtons />
      </div>
      <TablesOuter target={"vnicprofile"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onRowClick={(selectedRows) => {
          setVnicProfilesSelected(selectedRows)
          setDatacentersSelected([...selectedRows].map((r) => ({
            id: r?.dataCenterVo?.id,
            name: r?.dataCenterVo?.name
          })))
          setNetworksSelected([...selectedRows].map((r) => ({
            id: r?.networkVo?.id,
            name: r?.networkVo?.name
          })))
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
       />
       {/* <RVI16 iconDef={rvi16Lan2()}/> */}
      <SelectedIdView items={vnicProfilesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.VNIC_PROFILE}`}
        path="vnicProfiles"
      />
    </>
  );
};

export default VnicProfileDupl;
