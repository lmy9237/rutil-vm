import { useCallback } from "react"
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import SearchBox from "../../../components/button/SearchBox";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";
import { useAllTemplatesFromVnicProfiles } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name VnicProfileTemplates
 * @description vNic프로필에 종속 된 탬플릿 목록
 *
 * @prop {string} vnicProfileId vNic프로필 ID
 * @returns {JSX.Element} VnicProfileTemplates
 */
const VnicProfileTemplates = ({ 
  vnicProfileId
}) => {
  const {
    vnicProfilesSelected,
    datacentersSelected,
    networksSelected,
    templatesSelected, setTemplatesSelected
  } = useGlobal()
  const { 
    data: templates = [],
    isSuccess: isTemplatesSuccess,
    isError: isTemplatesError,
    isLoading: isTemplateLoading,
    refetch: refetchTemplates,
    isRefetching: isTemplatesRefetching,
  } = useAllTemplatesFromVnicProfiles(vnicProfileId, (e) => ({ 
    ...e
  }));

  const transformedData = [...templates]?.map((t) => ({
    ...t,
    _name: (
      <TableRowClick type="template" id={t?.id}>
        {t?.name}
      </TableRowClick>
    ),
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DiskVms > handleRefresh ... `)
    if (!refetchTemplates) return;
    refetchTemplates()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/*  */}
      </div>
      <TablesOuter target={"template"}
        columns={TableColumnsInfo.TEMPLATE_FROM_VNIC_PROFILE}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        multiSelect={true}
        isLoading={isTemplateLoading} isRefetching={isTemplatesRefetching} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
      <SelectedIdView items={templatesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.VNIC_PROFILE}>${vnicProfilesSelected[0]?.name}`}
        path={`vnicProfiles-templates;name=${vnicProfilesSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name};network=${networksSelected[0]?.name}`}
      />
    </>
  );
};

export default VnicProfileTemplates;
