import { useAllTemplatesFromVnicProfiles } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";

/**
 * @name VnicProfileTemplates
 * @description vNic프로필에 종속 된 탬플릿 목록
 *
 * @prop {string} vnicProfileId vNic프로필 ID
 * @returns {JSX.Element} VnicProfileTemplates
 */
const VnicProfileTemplates = ({ vnicProfileId }) => {
  const { 
    data: templates = [],
    isSuccess: isTemplatesSuccess,
    isError: isTemplatesError,
    isLoading: isTemplateLoading    
  } = useAllTemplatesFromVnicProfiles(vnicProfileId, (e) => ({ ...e }));

  const transformedData = templates.map((t) => ({
    ...t,
    _name: (
      <TableRowClick type="template" id={t?.id}>
        {t?.name}
      </TableRowClick>
    ),
  }));

  return (
    <TablesOuter
      isLoading={isTemplateLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
      columns={TableColumnsInfo.TEMPLATE_FROM_VNIC_PROFILES}
      data={transformedData}
    />
  );
};

export default VnicProfileTemplates;
