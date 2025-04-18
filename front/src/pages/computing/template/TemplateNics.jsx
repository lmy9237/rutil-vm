import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import NicActionButtons from "../../../components/dupl/NicActionButtons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SearchBox from "../../../components/button/SearchBox";
import NicModal from "../../../components/modal/vm/NicModal";
import { useAllNicsFromTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name TemplateNics
 * @description 탬플릿에 종속 된 nic 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateNics
 */
const TemplateNics = ({ 
  templateId,
  showSearchBox = true, 
  refetch,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { vnicProfilesSelected, setVnicProfilesSelected } = useGlobal()
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
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
  const handleRefresh = () =>  {
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("TemplateNics ...");
  return (
    <>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>)}
        <NicActionButtons
          isEditDisabled={vnicProfilesSelected.length !== 1}
        />
     </div>
      <TablesOuter
        columns={columns}
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setVnicProfilesSelected(selectedRows)}
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        onContextMenuItems={(row) => [
          <NicActionButtons type="context"
            isEditDisabled={!row}
          />,
        ]}
      />

      <SelectedIdView items={vnicProfilesSelected}/>

      {/* nic 모달창 */}
      {activeModal() === "nic:create" && (
        <NicModal key={activeModal()} isOpen={activeModal() === "nic:create"}
          onClose={() => setActiveModal(null)}
          vmId={templateId}   // ✅ templateId를 vmId처럼 넘김
          nicId={null}
        />
      )}
      {activeModal() === "nic:edit" && (
        <NicModal key={activeModal()} isOpen={activeModal() === "nic:updateedit"}
          onClose={() => setActiveModal(null)}
          editMode
          vmId={templateId}   // ✅ templateId를 vmId처럼 넘김
          nicId={vnicProfilesSelected[0]?.id}
        />
      )}
      {/* <Suspense fallback={<Loading />}>
        {activeModal() === "create" && (
          <TemplateNeworkNewInterModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            editMode={false}
            templateId={templateId}
            nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
          />
        )}
        {activeModal() === "edit" && (
          <TemplateNeworkNewInterModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            editMode={true}
            templateId={templateId}
            nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
          />
        )}

        {activeModal() === "delete" && (
          <TemplateNicDeleteModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            data={selectedVnicProfiles[0]} // 선택된 NIC 데이터 전달
            templateId={templateId}
          />
        )}
      </Suspense> */}
    </>
  );
};

export default TemplateNics;
