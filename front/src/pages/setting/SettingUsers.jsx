import React, { useState, Suspense } from 'react';
import SettingUsersActionButtons from "./SettingUsersActionButtons";
import SettingUsersModals from "../../components/modal/settings/SettingUsersModals"
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from "../../components/table/TablesOuter";
import { useAllUsers } from "../../api/RQHook";
import SettingUsersDeleteModal from '../../components/modal/settings/SettingUsersDeleteModal';
import { RVI16, rvi16User, rvi16Superuser } from '../../components/icons/RutilVmIcons';

/**
 * @name SettingUsers
 * @description 관리 > 사용자
 * 
 * @returns 
 */
const SettingUsers = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const selectedUserIds = (Array.isArray(selectedUsers) ? selectedUsers : [])
    .map((user) => user.id)
    .join(", ");
  
  const { 
    data: users = [],
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess,
    refetch: refetchUsers,
  } = useAllUsers((e) => {
    console.log(`SettingUsers ... ${JSON.stringify(e)}`)
    // const [username, provider] = e?.userName?.split('@') || [];
    return { ...e };
  });
  
  const transformedData = users.map((e) => {
    return {
      ...e,
      icon: (<RVI16 iconDef={rvi16Superuser}/>),
      isDisabled: (e.disabled) ? 'DISABLED' : 'AVAILABLE',
    }
  })

  const [activeModal, setActiveModal] = useState(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    changePassword: false,
    remove: false,
  });
  const toggleModal = (type, isOpen) => {
    console.log(`SettingUsers > toggleModal ... type: ${type}, isOpen: ${isOpen}`);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const openModal = (popupType) => {
    console.log(`SettingUsers > openPopup ... popupType: ${popupType}`)
    setActiveModal(popupType);
    if (popupType === "add") {
      setModals({create: true, edit:false, changePassword:false, remove:false})
      return
    }
    if (popupType === "edit") {
      setModals({create: false, edit:true, changePassword:false, remove:false})
      return
    }
    if (popupType === "changePassword") {
      setModals({create: false, edit:false, changePassword:true, remove:false})
      return
    }
    if (popupType === "remove") {
      setModals({create: false, edit:false, changePassword:false, remove:true})
      return
    }
  };

  const renderModals = () => {
    console.log("SettingUsers > renderModals ... ")
    return (
      <Suspense>
      {(modals.create || (modals.edit && selectedUsers) || (modals.changePassword && selectedUsers)) && (
          <SettingUsersModals 
            modalType={
              modals.create ? "create" : modals.edit ? "edit" : modals.changePassword ? "changePassword" : ""
            }
            user={selectedUsers}
            onClose={() => {
              toggleModal(modals.create ? "create" : modals.edit ? "edit" : "changePassword", false)
              refetchUsers()
            }}
          />
      )}
      {modals.remove && selectedUsers.length !== 0 && (
          <SettingUsersDeleteModal 
            isOpen={modals.remove}
            onClose={() => {
              toggleModal("remove", false)
              refetchUsers()
            }}
            data={selectedUsers}
          />
      )}
      </Suspense>
    )
  }
  
  const status = 
    selectedUsers.length === 0 ? "none"
      : selectedUsers.length === 1 ? "single"
      : "multiple";

  console.log("...")
  return (
    <>
      <SettingUsersActionButtons 
        openModal={openModal}
        isEditDisabled={selectedUsers.length !== 1}
        status={status}
      />
      <span>ID = { selectedUserIds ?? ""}</span>
      <TablesOuter
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        columns={TableColumnsInfo.SETTING_USER}
        data={transformedData}
        onRowClick={(row) => {
          setSelectedUsers(Array.isArray(row) ? row : [row]);
        }}
        onContextMenuItems={(row) => [
          <SettingUsersActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            actionType="context"
          />,
        ]}
      />
      
      {/* 모달창 */}
      {renderModals()}
    </>
  );
};
  
export default SettingUsers;
