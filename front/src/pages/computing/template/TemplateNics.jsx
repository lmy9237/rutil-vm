import { useCallback } from "react"
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { status2Icon }        from "@/components/icons/RutilVmIcons";
import {
  useAllNicsFromTemplate
} from "@/api/RQHook";
import TemplateNicActionbuttons from "@/components/dupl/TemplateNicActionbuttons";

/**
 * @name TemplateNics
 * @description 탬플릿에 종속 된 nic 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateNics
 */
const TemplateNics = ({ 
  templateId,
}) => {
  const { activeModal } = useUIState()
  const {
    templatesSelected,
    nicsSelected, setNicsSelected
  } = useGlobal()

  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
    refetch: refetchVnicProfiles,
    isRefetching: isVnicProfilesRefetching,
  } = useAllNicsFromTemplate(templateId, (e) => ({ ...e }));

  const transformedData = [...vnicProfiles]
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .map((nic) => ({
      ...nic,
      status: status2Icon(nic?.linked ? "UP" : "DOWN"),
      network: (
        <TableRowClick type="network" id={nic?.networkVo?.id}>
          {nic?.networkVo?.name}
        </TableRowClick>
      ),
      vnicProfile: (
        <TableRowClick type="vnicProfile" id={nic?.vnicProfileVo?.id}>
          {nic?.vnicProfileVo?.name}
        </TableRowClick>
      ),
      _linked: nic?.linked === true ? "UP" : "DOWN",
      _plugged: (
        <input type="checkbox" checked={nic?.plugged === true} disabled />
      ),
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchVnicProfiles}/>
        <TemplateNicActionbuttons />
      </div>
      <TablesOuter target={"templatenic"}
        columns={TableColumnsInfo.NICS_FROM_TEMPLATE}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0) return;
          setNicsSelected(selectedRows)
        }} 
        isLoading={isVnicProfilesLoading} isRefetching={isVnicProfilesRefetching}  isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
      />
      <SelectedIdView items={nicsSelected}/>
    </>
  );
};

export default TemplateNics;
