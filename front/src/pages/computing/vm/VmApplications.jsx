import { useApplicationFromVM } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";

/**
 * @name VmApplications
 * @description 가상머신에 종속 된 애플리케이션정보
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmApplications
 */
const VmApplications = ({ vmId }) => {
  const {
    data: applications = [],
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    isSuccess: isApplicationsSuccess,
  } = useApplicationFromVM(vmId, (e) => ({ ...e }));

  return (
    <div className="host-empty-outer">
      <TablesOuter
        isLoading={isApplicationsLoading} isError={isApplicationsError} isSuccess={isApplicationsSuccess}
        columns={TableColumnsInfo.APPLICATIONS_FROM_VM}
        data={applications.map((e) => ({
          name: e?.name,
        }))}
      />
    </div>
  );
};

export default VmApplications;
