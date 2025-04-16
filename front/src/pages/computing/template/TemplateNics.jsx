import { Suspense, useState } from "react";
import { useAllNicsFromTemplate } from "../../../api/RQHook";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import NicActionButtons from "../../../components/dupl/NicActionButtons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import Logger from "../../../utils/Logger";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";
import toast from "react-hot-toast";
import NicModal from "../../../components/modal/vm/NicModal";

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
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
  } = useAllNicsFromTemplate(templateId, (e) => ({ ...e }));
  const columns = TableColumnsInfo.NICS_FROM_TEMPLATE;
  const transformedData = vnicProfiles.map((nic) => ({
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

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVnicProfiles, setSelectedVnicProfiles] = useState([]);
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);
  const handleRefresh = () =>  {
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  Logger.debug("TemplateNics ...");
  return (
    <>
      <div className="dupl-header-group f-start">
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onRefresh={handleRefresh}
          />
        )}
      <NicActionButtons
        openModal={openModal}
        isEditDisabled={selectedVnicProfiles.length !== 1}
      />
     </div>
      <TablesOuter
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        columns={columns}   
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setSelectedVnicProfiles(selectedRows)}
        onContextMenuItems={(row) => [
          <NicActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
          />,
        ]}
      />

      <SelectedIdView items={selectedVnicProfiles}/>

      {/* nic 모달창 */}
      {activeModal === "create" && (
        <NicModal
          isOpen={true}
          onClose={closeModal}
          editMode={false}
          vmId={templateId}   // ✅ templateId를 vmId처럼 넘김
          nicId={null}
        />
      )}
      {activeModal === "edit" && (
        <NicModal
          isOpen={true}
          onClose={closeModal}
          editMode={true}
          vmId={templateId}   // ✅ templateId를 vmId처럼 넘김
          nicId={selectedVnicProfiles[0]?.id}
        />
      )}

      {/* <Suspense fallback={<Loading />}>
        {activeModal === "create" && (
          <TemplateNeworkNewInterModal
            isOpen={true}
            onClose={closeModal}
            editMode={false}
            templateId={templateId}
            nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
          />
        )}
        {activeModal === "edit" && (
          <TemplateNeworkNewInterModal
            isOpen={true}
            onClose={closeModal}
            editMode={true}
            templateId={templateId}
            nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
          />
        )}

        {activeModal === "delete" && (
          <TemplateNicDeleteModal
            isOpen={true}
            onClose={closeModal}
            data={selectedVnicProfiles[0]} // 선택된 NIC 데이터 전달
            templateId={templateId}
          />
        )}
      </Suspense> */}
    </>
  );
};

export default TemplateNics;
