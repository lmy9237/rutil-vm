import { Suspense, useState } from "react";
import { useAllNicsFromTemplate } from "../../../api/RQHook";
import Loading from "../../../components/common/Loading";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TemplateNicDeleteModal from "../../../components/modal/template/TemplateNicDeleteModal";
import TemplateNeworkNewInterModal from "../../../components/modal/template/TemplateNeworkNewInterModal";
// import NicActionButtons from "../../network/vnicProfile/NicActionButton";
import NicActionButtons from "../../../components/dupl/NicActionButtons";
import { renderTFStatusIcon } from "../../../components/Icon";

/**
 * @name TemplateNics
 * @description 탬플릿에 종속 된 nic 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateNics
 */
const TemplateNics = ({ templateId }) => {
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
  } = useAllNicsFromTemplate(templateId, (e) => ({ ...e }));

  const transformedData = vnicProfiles.map((nic) => ({
      ...nic,
      status: renderTFStatusIcon(nic?.linked),
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
      _linked: nic?.linked === true ? "Up" : "Down",
      _plugged: (
        <input type="checkbox" checked={nic?.plugged === true} disabled />
      ),
    }))

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVnicProfiles, setSelectedVnicProfiles] = useState([]);
  const selectedIds = (Array.isArray(selectedVnicProfiles) ? selectedVnicProfiles : []).map((vnic) => vnic.id).join(", ");

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  console.log("...");
  return (
    <>
      <NicActionButtons
        openModal={openModal}
        isEditDisabled={selectedVnicProfiles.length !== 1}
      />
      <span>선택된 NIC ID: {selectedIds || "없음"}</span>

      <TablesOuter
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        columns={TableColumnsInfo.NICS_FROM_TEMPLATE}
        data={transformedData}
        onRowClick={(selectedRows) => setSelectedVnicProfiles(selectedRows)}
        onContextMenuItems={(row) => [
          <NicActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
          />,
        ]}
      />

      {/* nic 모달창 */}
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
};

export default TemplateNics;
