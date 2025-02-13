import { useApplicationFromVM } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";

// 애플리케이션 섹션
const VmApplications = ({ vmId }) => {
  const { 
    data: applications = [], 
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    isSuccess: isApplicationsSuccess,
  } = useApplicationFromVM(vmId, (e) => ({...e}));

  console.log("...")
  return (
      <div className="host-empty-outer">
        <TablesOuter
          isLoading={isApplicationsLoading} isError={isApplicationsError} isSuccess={isApplicationsSuccess}
          columns={TableColumnsInfo.APPLICATIONS_FROM_VM}
          data={applications.map((e) => ({
            name: e?.name
          }))}
        />
      </div>
  );
};
  
export default VmApplications;