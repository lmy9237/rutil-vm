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
    data: templates = []
  } = useAllTemplatesFromVnicProfiles(vnicProfileId, (e) => ({ 
    ...e 
  }));

  return (
    <TablesOuter
      columns={TableColumnsInfo.TEMPLATE_FROM_VNIC_PROFILES}
      data={templates.map((t) => ({
        ...t,
        name: (
          <TableRowClick type="templates" id={t?.id}>
            {t?.name}
          </TableRowClick>
        ),
      }))}
    />
  );
};

export default VnicProfileTemplates;
