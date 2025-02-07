import { useAllTemplatesFromVnicProfiles} from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";

const VnicProfileTemplates = ({  vnicProfileId  }) => {
  const { 
    data: templates = [] 
  } = useAllTemplatesFromVnicProfiles(vnicProfileId, (e) => ({...e,}));
  
  return (
    <TablesOuter
      columns={TableColumnsInfo.TEMPLATE_FROM_VNIC_PROFILES}
      data={templates.map((t) => ({
        ...t,
        name: <TableRowClick type="templates" id={t?.id}>{t?.name}</TableRowClick>,
      }))}
    />
  );
};

export default VnicProfileTemplates;