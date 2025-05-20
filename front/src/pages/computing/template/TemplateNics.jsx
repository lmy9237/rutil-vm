import { useCallback } from "react"
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import VmNicActionButtons from "../../../components/dupl/VmNicActionButtons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SearchBox from "../../../components/button/SearchBox";
import VmNicModal from "../../../components/modal/vm/VmNicModal";
import { useAllNicsFromTemplate } from "../../../api/RQHook";

/**
 * @name TemplateNics
 * @description 탬플릿에 종속 된 nic 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateNics
 */
const TemplateNics = ({ 
  templateId,
  refetch,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const {
    vnicProfilesSelected, setVnicProfilesSelected
  } = useGlobal()
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
    refetch: refetchVnicProfiles,
    isRefetching: isVnicProfilesRefetching,
  } = useAllNicsFromTemplate(templateId, (e) => ({ ...e }));

  const columns = TableColumnsInfo.NICS_FROM_TEMPLATE;
  const transformedData = (!Array.isArray(vnicProfiles) ? [] : vnicProfiles).map((nic) => ({
      ...nic,
      status: status2Icon(nic?.linked ? "UP" : "DOWN"),
      network: (
        <TableRowClick type="network" id={nic?.networkVo?.id}>
          {nic?.networkVo?.name}
        </TableRowClick>
      ),
      vnicProfile: (
        <TableRowClick type="vnicProfile" id={nic?.vnicProfileVo?.id}>
          {nic?.vnicProfileVo?.name}
        </TableRowClick>
      ),
      _linked: nic?.linked === true ? "UP" : "DOWN",
      _plugged: (
        <input type="checkbox" checked={nic?.plugged === true} disabled />
      ),
    }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);
  const handleRefresh = useCallback(() => {
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
        <VmNicActionButtons />
      </div>
      <TablesOuter target={"vnicprofile"}
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVnicProfilesSelected(selectedRows)}
        isLoading={isVnicProfilesLoading} isRefetching={isVnicProfilesRefetching}  isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
      />
      <SelectedIdView items={vnicProfilesSelected}/>
      {/* 
        {activeModal().includes("nic:remove") && (
          <TemplateNicDeleteModal
            isOpen={activeModal().includes("nic:remove")}
            data={selectedVnicProfiles[0]} // 선택된 NIC 데이터 전달
            templateId={templateId}
          />
        )}
      </Suspense> */}
    </>
  );
};

export default TemplateNics;
