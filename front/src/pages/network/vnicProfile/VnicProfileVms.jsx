import { useAllVmsFromVnicProfiles } from "../../../api/RQHook";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";

/**
 * @name VnicProfileVms
 * @description vNic프로필에 종속 된 가상머신 목록
 *
 * @prop {string} vnicProfileId vNic프로필 ID
 * @returns {JSX.Element} VnicProfileVms
 */
const VnicProfileVms = ({ vnicProfileId }) => {
  const {
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    data: vms = [],
  } = useAllVmsFromVnicProfiles(vnicProfileId, (e) => ({ ...e }));

  const transformedData = vms.map((vm) => ({
    ...vm,
    name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
  }))

  return (
    <TablesOuter
      isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      columns={TableColumnsInfo.VMS_FROM_VNIC_PROFILE}
      data={transformedData}
    />
  );
};

export default VnicProfileVms;
