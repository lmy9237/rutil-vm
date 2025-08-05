import React, { useCallback } from "react";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import { status2Icon }                  from "@/components/icons/RutilVmIcons";
import {
  useAllVmsFromTemplate
} from "@/api/RQHook";
import Logger                           from "@/utils/Logger";

/**
 * @name TemplateVms
 * @description 탬플릿에 종속 된 가상머신 목록
*
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateVms
 */
const TemplateVms = ({
  templateId 
}) => {
  const { vmsSelected, setVmsSelected } = useGlobal()

  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useAllVmsFromTemplate(templateId, (e) => ({ ...e }));

  const transformedData = vms.map((e) => ({
    ...e,
    icon: status2Icon(e.status),
    _name: (
      <TableRowClick type="vm" id={e?.id} hideIcon>
        {e?.name}
      </TableRowClick>
    ),
    host: (
      <TableRowClick type="host" id={e?.hostVo?.id}>
        {e?.hostVo?.name}
      </TableRowClick>
    ),
    ipv4: `${e?.ipv4} ${e?.ipv6}`,
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isVmsLoading} isRefetching={isVmsRefetching} refetch={refetchVms}
        />
        <LoadingFetch isLoading={isVmsLoading} isRefetching={isVmsRefetching} />
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_FROM_TEMPLATE}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        isLoading={isVmsLoading} isRefetching={isVmsRefetching} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
    </>
  );
};

export default TemplateVms;
