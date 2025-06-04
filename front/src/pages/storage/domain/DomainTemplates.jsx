import React, { useMemo } from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  useAllTemplatesFromDomain
} from "@/api/RQHook";
import { checkZeroSizeToGiB } from "@/util";
import Localization           from "@/utils/Localization";
import { useNavigate } from "react-router-dom";

/**
 * @name DomainTemplates
 * @description 도메인에 종속 된 Template정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainTemplates
 *
 * @see DomainGetVms
 * @see DomainImportTemplates
 */
const DomainTemplates = ({
  domainId
}) => {
  const navigate = useNavigate();
  const {
    domainsSelected,
    templatesSelected, setTemplatesSelected 
  } = useGlobal()
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
    isRefetching: isTemplatesRefetching,
  } = useAllTemplatesFromDomain(domainId ?? domainsSelected[0]?.id, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...templates].map((t) => ({
    ...t,
    _name: (
      <TableRowClick type="template" id={t?.id}>
        {t?.name}
      </TableRowClick>
    ),
    disk: (
      <span 
        onClick={() => navigate(`/computing/templates/${t?.id}/disks`)} 
        style={{ color: 'rgb(9, 83, 153)' }}
      > {t?.diskAttachmentVos?.length} 
      </span>
    ),
    // virtualSize: checkZeroSizeToGiB(t?.memoryGuaranteed), 
    // actualSize: checkZeroSizeToGiB(t?.memoryActual),
    creationTime: t?.creationTime || "-", 
  })), [templates]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  // TODO: 필요하면 정리
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchTemplates} />
        {/* <EventActionButtons /> */}
      </div>
      <TablesOuter target={"template"} 
        columns={TableColumnsInfo.TEMPLATES_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setTemplatesSelected(selectedRows)}
        isLoading={isTemplatesLoading} isRefetching={isTemplatesRefetching} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      />
      <SelectedIdView items={templatesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-templates;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainTemplates;
