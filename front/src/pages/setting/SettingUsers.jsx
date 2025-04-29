import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import SelectedIdView from "../../components/common/SelectedIdView";
import SearchBox from "../../components/button/SearchBox";
import SettingUsersActionButtons from "../../components/dupl/SettingUsersActionButtons";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TablesOuter";
import {
  RVI16,
  rvi16Superuser,
} from "../../components/icons/RutilVmIcons";
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
  const { usersSelected, setUsersSelected } = useGlobal();
  
  const { 
    data: users = [],
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess,
    refetch: refetchUsers,
  } = useAllUsers((e) => ({ ...e  }));
  
  const transformedData = [...users].map((e) => ({
    ...e,
    icon: (<RVI16 iconDef={rvi16Superuser}/>),
    isDisabled: (e.disabled),
    _isDisabled: (e.disabled) ? 'DISABLED' : 'AVAILABLE',
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.SETTING_USER);

  const handleNameClick = useCallback((id) => {
    navigate(`/networks/${id}`);
  }, [navigate])
    
  const handleRefresh = useCallback(() => {
    Logger.debug(`SettingUsers > handleRefresh ... `)
    if (!refetchUsers) return;
    refetchUsers()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
      <SettingUsersActionButtons />
      <TablesOuter target={"user"}
        columns={TableColumnsInfo.SETTING_USER}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => setUsersSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        /*onContextMenuItems={(row) => [
          <SettingUsersActionButtons actionType="context" />,
        ]}*/
      />
      <SelectedIdView items={usersSelected} />
    </>
  );
};
  
export default SettingUsers;
