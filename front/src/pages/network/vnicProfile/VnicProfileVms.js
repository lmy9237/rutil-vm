import { useAllVmsFromVnicProfiles } from '../../../api/RQHook';
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from '../../../components/table/TableRowClick';

const VnicProfileVms = ({ vnicProfileId  }) => {
  const { 
    data: vms = [] 
  } = useAllVmsFromVnicProfiles(vnicProfileId, (e) => ({...e,}));
  
  return (
    <TablesOuter
      columns={TableColumnsInfo.VMS_FROM_VNIC_PROFILES}
      data={vms.map((vm) => ({
        ...vm,
        name: <TableRowClick type="vms" id={vm?.id}>{vm?.name}</TableRowClick>,
      }))}
  />
  );
};

export default VnicProfileVms;