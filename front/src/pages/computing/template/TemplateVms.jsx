import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import { useAllVmsFromTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name TemplateVms
 * @description 탬플릿에 종속 된 가상머신 목록
*
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateVms
 */
const TemplateVms = ({ templateId }) => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
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

  Logger.debug("...");
  return (
    <>
      <TablesOuter
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS_FROM_TEMPLATE}
        data={transformedData}
      />
    </>
  );
};

export default TemplateVms;
