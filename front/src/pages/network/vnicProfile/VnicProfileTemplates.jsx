import { useCallback } from "react"
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SearchBox from "../../../components/button/SearchBox";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";
import { useAllTemplatesFromVnicProfiles } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";

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
  const { templatesSelected, setTemplatesSelected } = useGlobal()
  const { 
    data: templates = [],
    isSuccess: isTemplatesSuccess,
    isError: isTemplatesError,
    isLoading: isTemplateLoading,
    refetch: refetchTemplates,
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
        refetch={refetchTemplates}
        isLoading={isTemplateLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
      <SelectedIdView items={templatesSelected} />
    </>
  );
};

export default VnicProfileTemplates;
