import React, { Suspense, useState } from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import PagingTableOuter from "../../components/table/PagingTableOuter";
import SettingUserSessionsActionButtons from "./SettingUserSessionsActionButtons";
import SettingUserSessionsModals from "../../components/modal/settings/SettingUserSessionsModals"
import { useAllUserSessions } from "../../api/RQHook";

/**
 * @name SettingSessions
 * @description 관리 > 활성 사용자 세션
 *
 * @returns {JSX.Element} SettingSessions
 */
const SettingSessions = () => {
  const [selectedUserSessions, setSelectedUserSessions] = useState([]);
  const selectedUserSessionIds = (Array.isArray(selectedUserSessions) ? selectedUserSessions : [])
    .map((userSession) => userSession.id)
    .join(", ");

  const {
    data: userSessions = [],
    isLoading: isUserSessionsLoading,
    isError: isUserSessionsError,
    isSuccess: isUserSessionsSuccess,
    refetch: refetchUserSessios
  } = useAllUserSessions("", (e) => {
    console.log(`SettingSessions ... ${JSON.stringify(e)}`);
    // const [username, provider] = e?.userName?.split('@') || [];
    return {
      ...e,
    };
  });

  const [activeModal, setActiveModal] = useState(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    remove: false,
  });
  const toggleModal = (type, isOpen) => {
    console.log(
      `SettingSessions > toggleModal ... type: ${type}, isOpen: ${isOpen}`
    );
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const openModal = (popupType) => {
    console.log(`SettingSessions > openPopup ... popupType: ${popupType}`);
    setActiveModal(popupType);
    if (popupType === "endSession") {
      setModals({ endSession: true });
      return;
    }
  };

  const renderModals = () => {
    console.log("SettingSessions > renderModals ... ");
    return (
      <Suspense>
        {/* {modals.endSession && (
          <SettingUserSessionsModals
            modalType={modals.create ? "create" : modals.edit ? "edit" : ""}
            user={selectedUserSessions}
            onClose={() => {
              toggleModal(modals.create ? "create" : "edit", false);
              refetchUserSessios();
            }}
          />
        )} */}
      </Suspense>
    );
  };

  const status =
    selectedUserSessions.length === 0
      ? "none"
      : selectedUserSessions.length === 1
        ? "single"
        : "multiple";

  console.log("...");
  return (
    <>
      <SettingUserSessionsActionButtons
        openModal={openModal}
        isEditDisabled={selectedUserSessions.length !== 1}
        status={status}
      />

      <span>ID = {selectedUserSessions?.id || ""}</span>
      <PagingTableOuter
        isLoading={isUserSessionsLoading}
        isError={isUserSessionsError}
        isSuccess={isUserSessionsSuccess}
        columns={TableColumnsInfo.ACTIVE_USER_SESSION}
        data={userSessions}
        onRowClick={(row) => {
          console.log(
            `SettingSessions > onRowClick ... row: ${JSON.stringify(row)}`
          );
          setSelectedUserSessions(row);
        }}
        showSearchBox={true} // 검색 박스 표시 여부 제어
      />

      {/* 모달창 */}
      {renderModals()}
    </>
  );
};

export default SettingSessions;
