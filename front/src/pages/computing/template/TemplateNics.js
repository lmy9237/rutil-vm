import { Suspense, useState } from "react";
import { useAllNicsFromTemplate } from "../../../api/RQHook";
import Loading from "../../../components/common/Loading";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TemplateNicDeleteModal from "../../../components/modal/template/TemplateNicDeleteModal";
import TemplateNeworkNewInterModal from '../../../components/modal/template/TemplateNeworkNewInterModal';
import NicActionButtons from "../../network/vnicProfile/NicActionButton";
import { renderTFStatusIcon } from "../../../components/Icon";

const TemplateNics = ({ templateId }) => {
  const { 
    data: vnicProfiles = [], 
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
  } = useAllNicsFromTemplate(templateId, (e) => ({ 
    ...e
  }));

  console.log("API Response:", vnicProfiles);
  console.log("Template ID:", templateId);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedVnicProfiles, setSelectedVnicProfiles] = useState([]); 
  const selectedIds = (Array.isArray(selectedVnicProfiles) ? selectedVnicProfiles : []).map(vnic => vnic.id).join(', ');

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  // 템플릿에 연결된 vNIC 프로파일 데이터 가져오기

  const renderModals = () => (
    <Suspense fallback={<Loading/>}>
      {activeModal === 'create' && (
        <TemplateNeworkNewInterModal
          isOpen={true}
          onRequestClose={closeModal}
          editMode={false}
          templateId={templateId}
          nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
        />
      )}
      {activeModal === 'edit' && (
        <TemplateNeworkNewInterModal
          isOpen={true}
          onRequestClose={closeModal}
          editMode={true}
          templateId={templateId}
          nicData={selectedVnicProfiles[0]} // 수정 시 첫 번째 항목 전달
        />
      )}
      
      {activeModal === 'delete' && (
        <TemplateNicDeleteModal
          isOpen={true}
          onClose={closeModal}
          data={selectedVnicProfiles[0]} // 선택된 NIC 데이터 전달
          templateId={templateId}
        />
      )}
    </Suspense>
  );

  console.log("...")
  return (
    <>
      <NicActionButtons
        openModal={openModal}
        isEditDisabled={selectedVnicProfiles.length !== 1}
      />
      <span>선택된 Template ID: {templateId || '없음'}</span>
      <br />
      <span>선택된 NIC ID: {selectedIds || '없음'}</span>

      <TablesOuter
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        columns={TableColumnsInfo.NICS_FROM_TEMPLATE}
        data={vnicProfiles.map((nic) => ({
          ...nic,
          status: renderTFStatusIcon(nic?.linked),
          network: <TableRowClick type="network" id={nic?.networkVo?.id}>{nic?.networkVo?.name}</TableRowClick>,
          vnicProfile: <TableRowClick type="vnicProfile" id={nic?.vnicProfileVo?.id}>{nic?.vnicProfileVo?.name}</TableRowClick>,
          _linked: nic?.linked === true ? "Up" : 'Down',
          _plugged: <input type="checkbox" checked={nic?.plugged === true} disabled />,
        }))}
        onRowClick={(selectedRows) => setSelectedVnicProfiles(selectedRows)}
        clickableColumnIndex={[3, 4]} // 클릭 가능한 열 인덱스
        onContextMenuItems={(row) => [
          <NicActionButtons
            openModal={openModal}
            isEditDisabled={!row} 
            type='context'
          />
        ]}
      />

      {/* nic 모달창 */}
      { renderModals() }
    </>
  );
};

export default TemplateNics;
