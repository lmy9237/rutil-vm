import React, { Suspense, useState } from "react";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import SelectedIdView from "../../components/common/SelectedIdView";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import SettingUserSessionsActionButtons from "./SettingUserSessionsActionButtons";
import { useAllUserSessions } from "../../api/RQHook";
import TablesOuter from "../../components/table/TablesOuter";
import Logger from "../../utils/Logger";

/**
 * @name SettingSessions
 * @description 관리 > 활성 사용자 세션
 *
 * @returns {JSX.Element} SettingSessions
 */
const SettingSessions = () => {
  const { activeModal, setActiveModal, } = useUIState()
  const { userSessionsSelected, setUserSessionsSelected } = useGlobal()

  const {
    data: userSessions = [],
    isLoading: isUserSessionsLoading,
    isError: isUserSessionsError,
    isSuccess: isUserSessionsSuccess,
    refetch: refetchUserSessios
  } = useAllUserSessions("", (e) => {
    Logger.debug(`SettingSessions ... ${JSON.stringify(e, null, 2)}`);
    // const [username, provider] = e?.userName?.split('@') || [];
    return {
      ...e,
    };
  });

  const renderModals = () => {
    Logger.debug("SettingSessions > renderModals ... ");
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
  userSessionsSelected.length === 0
      ? "none"
      : userSessionsSelected.length === 1
        ? "single"
        : "multiple";

  Logger.debug("SettingSessions ...");
  return (
    <>
      <SettingUserSessionsActionButtons
        isEditDisabled={userSessionsSelected.length !== 1}
        status={status}
      />

      <TablesOuter
        isLoading={isUserSessionsLoading}
        isError={isUserSessionsError}
        isSuccess={isUserSessionsSuccess}
        columns={TableColumnsInfo.ACTIVE_USER_SESSION}
        data={userSessions}
        onRowClick={(row) => setUserSessionsSelected(row)}
        showSearchBox={true} // 검색 박스 표시 여부 제어
      />

      <SelectedIdView items={userSessionsSelected} />

      {/* 모달창 */}
      {renderModals()}
    </>
  );
};

export default SettingSessions;
