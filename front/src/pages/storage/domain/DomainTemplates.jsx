import React, { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import SearchBox from "../../../components/button/SearchBox";
import { useAllTemplatesFromDomain } from "../../../api/RQHook";
import TableRowClick from "../../../components/table/TableRowClick";
import Logger from "../../../utils/Logger";
import { checkZeroSizeToGiB } from "../../../util";



/**
 * @name DomainTemplates
 * @description 도메인에 종속 된 Template정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainTemplates
 *
 * @see DomainGetVms
 */
const DomainTemplates = ({
  domainId
}) => {
  const { domainsSelected, setTemplatesSelected } = useGlobal()
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
  } = useAllTemplatesFromDomain(domainId ?? domainsSelected[0]?.id, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...templates].map((t) => ({
    ...t,
    _name: (
      <TableRowClick type="template" id={t?.id}>
        {t?.name}
      </TableRowClick>
    ),
    disk: (t?.diskAttachmentVos?.length || "") ,
    virtualSize: checkZeroSizeToGiB(t?.memoryGuaranteed), 
    actualSize: checkZeroSizeToGiB(t?.memorySize),
    creationTime: t?.creationTime || "-", 
  })), [templates]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`EventDupl > handleRefresh ... `)
    if (!refetchTemplates) return;
    refetchTemplates()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])
  
  Logger.debug("DomainTemplates ...");
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/* <EventActionButtons /> */}
      </div>

      <TablesOuter target={"template"} 
        columns={TableColumnsInfo.TEMPLATES_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        refetch={refetchTemplates}
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
    </div>
  );
};

export default DomainTemplates;
