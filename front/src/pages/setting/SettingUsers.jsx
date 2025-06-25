import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import SettingUsersActionButtons from "@/components/dupl/SettingUsersActionButtons";
import TablesOuter            from "@/components/table/TablesOuter";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  RVI16,
  rvi16Superuser,
} from "@/components/icons/RutilVmIcons";
import { useAllUsers } from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name SettingUsers
 * @description 관리 > 사용자
 * 
 * @returns 
 */
const SettingUsers = () => {
  const navigate = useNavigate()
  const {
    usersSelected, setUsersSelected
  } = useGlobal();
  
  const { 
    data: users = [],
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess,
    refetch: refetchUsers,
    isRefetching: isUsersRefetching,
  } = useAllUsers((e) => ({ ...e  }));
  
  const transformedData = [...users].map((e) => ({
    ...e,
    icon: (<RVI16 iconDef={rvi16Superuser}/>),
    isDisabled: e?.disabled,
    _isDisabled: e?.disabled ? 'DISABLED' : 'AVAILABLE',
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.SETTING_USER);

  const handleNameClick = useCallback((id) => {
    navigate(`/networks/${id}`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchUsers} />
        <SettingUsersActionButtons />
      </div>
      <TablesOuter target={"user"}
        columns={TableColumnsInfo.SETTING_USER}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => { setUsersSelected(selectedRows) } }
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isUsersLoading} isRefetching={isUsersRefetching} isError={isUsersError} isSuccess={isUsersSuccess}
        /*onContextMenuItems={(row) => [
          <SettingUsersActionButtons actionType="context" />,
        ]}*/
      />
      <SelectedIdView items={usersSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.MANAGEMENT}>${Localization.kr.USER}`}
        path={`users`}
      />
    </>
  );
};
  
export default SettingUsers;
