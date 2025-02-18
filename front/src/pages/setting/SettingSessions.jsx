import React, { useState } from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from '../../components/table/TablesOuter';
import { useAllUsers } from "../../api/RQHook";

/**
 * @name SettingSessions
 * @description 관리 > 활성 사용자 세션
 * 
 * @returns {JSX.Element} SettingSessions
 */
const SettingSessions = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const selectedUserIds = (Array.isArray(selectedUsers) ? selectedUsers : [])
    .map((user) => user.id)
    .join(", ");

  const { 
    data: users = [], 
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess 
  } = useAllUsers((e) => {
    console.log(`SettingUsers ... ${JSON.stringify(e)}`)
    // const [username, provider] = e?.userName?.split('@') || [];
    return { ...e, };
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const status = 
    selectedUsers.length === 0 ? "none"
      : selectedUsers.length === 1 ? "single"
      : "multiple";
      
  console.log("...")
  return (
    <>
      <span>ID = {selectedUser?.id || ''}</span>
      <TablesOuter
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        columns={TableColumnsInfo.SETTING_USER}
        data={users}
        onRowClick={(row) => {
          console.log(`SettingUsers > onRowClick ... row: ${JSON.stringify(row)}`)
          setSelectedUsers(row)
        }}
      />      
    </>
  );
};
  
export default SettingSessions;
