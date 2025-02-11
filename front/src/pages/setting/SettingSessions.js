import React, { useState } from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from '../../components/table/TablesOuter';
import { useAllUsers } from "../../api/RQHook";

/**
 * @name SettingSessions
 * @description 관리 > 활성 사용자 세션
 * 
 * @returns 
 */
const SettingSessions = () => {
  const { 
    data: users = [], 
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess 
  } = useAllUsers((e) => {
    const [username, provider] = e?.userName?.split('@') || [];
    return {
      ...e,
      username: username || '', // @ 앞의 값
      provider: provider || '', // @ 뒤의 값
    };
  });

  const [selectedUser, setSelectedUser] = useState(null);

  console.log("...")
  return (
    <>
      <span>id = {selectedUser?.id || ''}</span>
      <TablesOuter
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        columns={TableColumnsInfo.SETTING_USER}
        data={users}
        onRowClick={(row) => setSelectedUser(row)}
      />      
    </>
  );
};
  
export default SettingSessions;
