import { useApplicationFromVM } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";

// 애플리케이션 섹션
const VmApplications = ({ vmId }) => {
  const { 
    data: applications = [], isLoading,  
  } = useApplicationFromVM(vmId, (e) => ({...e}));

  return (
      <div className="host_empty_outer">
        <TablesOuter
          columns={TableColumnsInfo.APPLICATIONS_FROM_VM}
          data={applications.map((e) => ({
            name: e?.name
          }))}
        />
      </div>
  );
};
  
export default VmApplications;