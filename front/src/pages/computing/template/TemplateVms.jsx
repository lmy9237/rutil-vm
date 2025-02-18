import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useAllVmsFromTemplate } from "../../../api/RQHook";
import TablesOuter from "../../../components/table/TablesOuter";
import { renderVmStatusIcon } from "../../../components/Icon";

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
  } = useAllVmsFromTemplate(templateId, (e) => ({
    ...e,
    icon: renderVmStatusIcon(e.status),
    hostVo: e?.hostVo.name,
  }));

  console.log("...");
  return (
    <>
      <TablesOuter
        isLoading={isVmsLoading}
        isError={isVmsError}
        isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS_FROM_TEMPLATE}
        data={vms}
        clickableColumnIndex={[1]}
      />
    </>
  );
};

export default TemplateVms;
