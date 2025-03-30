import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { useAllTemplateFromDomain } from "../../../api/RQHook";
import TableRowClick from "../../../components/table/TableRowClick";
import Logger from "../../../utils/Logger";

/**
 * @name DomainTemplates
 * @description 도메인에 종속 된 Template정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainTemplates
 *
 * @see DomainGetVms
 */
const DomainTemplates = ({ domainId }) => {
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplateFromDomain(domainId, (e) => ({ ...e }));

  const transformedData = templates.map((t) => ({
    ...t,
    _name: (
      <TableRowClick type="template" id={t?.id}>
        {t?.name}
      </TableRowClick>
    ),
    // virtualSize: checkZeroSizeToGB(vm?.memoryGuaranteed),
    // actualSize: checkZeroSizeToGB(vm?.memorySize),
    // disk: (
    //   <span 
    //     onClick={() => navigate(`/computing/vms/${vm?.id}/disks`)} 
    //     style={{ color: 'rgb(9, 83, 153)' }}
    //   > {vm?.diskAttachmentVos?.length} 
    //   </span>
    // ),
  }));

  Logger.debug("...");
  return (
    <>
      <TablesOuter
        isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        columns={TableColumnsInfo.TEMPLATES_FROM_STORAGE_DOMAIN}
        data={transformedData}
      />
    </>
  );
};

export default DomainTemplates;
