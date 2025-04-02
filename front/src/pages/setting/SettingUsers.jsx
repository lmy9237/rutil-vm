import React, { useState, Suspense } from 'react';
import { navigate } from '@storybook/addon-links';
import toast from 'react-hot-toast';
import SettingUsersActionButtons from "./SettingUsersActionButtons";
import SettingUsersModals from "../../components/modal/settings/SettingUsersModals"
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from "../../components/table/TablesOuter";
import SettingUsersDeleteModal from '../../components/modal/settings/SettingUsersDeleteModal';
import { RVI16, rvi16User, rvi16Superuser } from '../../components/icons/RutilVmIcons';
import Logger from '../../utils/Logger';
import SelectedIdView from '../../components/common/SelectedIdView';
import useSearch from '../../components/button/useSearch';
import { useAllUsers } from "../../api/RQHook";
import SearchBox from '../../components/button/SearchBox';

/**
 * @name SettingUsers
 * @description 관리 > 사용자
 * 
 * @returns 
 */
const SettingUsers = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const { 
    data: users = [],
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess,
    refetch: refetchUsers,
  } = useAllUsers((e) => {
    Logger.debug(`SettingUsers ... ${JSON.stringify(e, null ,2)}`)
    return { ...e };
  });
  
  const transformedData = users.map((e) => {
    return {
      ...e,
      icon: (<RVI16 iconDef={rvi16Superuser}/>),
      isDisabled: (e.disabled),
      _isDisabled: (e.disabled) ? 'DISABLED' : 'AVAILABLE',
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
    Logger.debug(`SettingUsers > toggleModal ... type: ${type}, isOpen: ${isOpen}`);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const openModal = (popupType) => {
    Logger.debug(`SettingUsers > openPopup ... popupType: ${popupType}`)
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
    Logger.debug("SettingUsers > renderModals ... ")
    return (
      <Suspense>
      {(modals.create || (modals.edit && selectedUsers) || (modals.changePassword && selectedUsers)) && (
        <SettingUsersModals 
          modalType={
            modals.create ? "create" 
              : modals.edit ? "edit" 
              : modals.changePassword  ? "changePassword"  : ""
          }
          user={selectedUsers}
          onClose={() => {
            toggleModal(modals.create ? "create"
              : modals.edit ? "edit"
              : "changePassword"
              , false)
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
  
  const status = selectedUsers.length === 0 
      ? "none"
      : selectedUsers.length === 1 
        ? "single"
        : "multiple";

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.SETTING_USER);

  const showSearchBox = true
  const handleNameClick = (id) => navigate(`/networks/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`SettingUsers > handleRefresh ... `)
    if (!refetchUsers) return;
    refetchUsers()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("SettingUsers ...")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (
          <SearchBox
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onRefresh={handleRefresh}
          />
        )}
        <SettingUsersActionButtons 
          openModal={openModal}
          isEditDisabled={selectedUsers.length !== 1}
          status={status}
        />
      </div>
      
      <TablesOuter columns={TableColumnsInfo.SETTING_USER}
        data={filteredData}
        onRowClick={(selectedRows) => setSelectedUsers(selectedRows)}
        onContextMenuItems={(row) => [
          <SettingUsersActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            actionType="context"
          />,
        ]}
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
      />

      <SelectedIdView items={selectedUsers} />
      
      {/* 모달창 */}
      {renderModals()}
    </div>
  );
};
  
export default SettingUsers;
