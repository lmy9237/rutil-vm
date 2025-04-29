import React, { useCallback } from "react";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import { useAllVmsFromTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import toast from "react-hot-toast";
import SearchBox from "../../../components/button/SearchBox";
import SelectedIdView from "../../../components/common/SelectedIdView";

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
  } = useAllVmsFromTemplate(templateId, (e) => ({ ...e }));

  const transformedData = vms.map((e) => ({
    ...e,
    icon: status2Icon(e.status),
    _name: (
      <TableRowClick type="vm" id={e?.id}>
        {e?.name}
      </TableRowClick>
    ),
    host: (
      <TableRowClick type="host" id={e?.hostVo?.id}>
        {e?.hostVo?.name}
      </TableRowClick>
    ),
    ipv4: e?.ipv4 + " " + e?.ipv6,
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`EventDupl > handleRefresh ... `)
    if (!refetchVms) return;
    refetchVms()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/*  */}
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_FROM_TEMPLATE}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        refetch={refetchVms}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
    </>
  );
};

export default TemplateVms;
