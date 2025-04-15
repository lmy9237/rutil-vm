import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import SearchBox from "../../components/button/SearchBox";
import SettingUsersActionButtons from "./SettingUsersActionButtons";
import SettingUsersModals from "../../components/modal/settings/SettingUsersModals";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TablesOuter";
import {
  RVI16,
  rvi16Superuser,
} from "../../components/icons/RutilVmIcons";
import SelectedIdView from "../../components/common/SelectedIdView";
import { useAllUsers } from "../../api/RQHook";
import Logger from "../../utils/Logger";


/**
 * @name SettingUsers
 * @description 관리 > 사용자
 * 
 * @returns 
 */
const SettingUsers = () => {
  const navigate = useNavigate()
  const { activeModal, setActiveModal, } = useUIState()
  const { usersSelected, setUsersSelected } = useGlobal();
  
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
  
  const transformedData = (!Array.isArray(users) ? [] : users).map((e) => ({
    ...e,
    icon: (<RVI16 iconDef={rvi16Superuser}/>),
    isDisabled: (e.disabled),
    _isDisabled: (e.disabled) ? 'DISABLED' : 'AVAILABLE',
  }))

  const status = usersSelected.length === 0 
      ? "none"
      : usersSelected.length === 1 
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
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
        <SettingUsersActionButtons status={status} />
      </div>
      
      <TablesOuter columns={TableColumnsInfo.SETTING_USER}
        data={filteredData}
        onRowClick={(selectedRows) => setUsersSelected(selectedRows)}
        onContextMenuItems={(row) => [
          <SettingUsersActionButtons actionType="context" />,
        ]}
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
      />

      <SelectedIdView items={usersSelected} />
      
      {/* 모달창 */}
      <SettingUsersModals />
    </div>
  );
};
  
export default SettingUsers;
