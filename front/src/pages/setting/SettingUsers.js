import React, { useState } from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllUsers } from "../../api/RQHook";
import TablesOuter from '../../components/table/TablesOuter';
// import HostDupl from './../duplication/HostDupl';

const SettingUsers = () => {
  const { 
    data: users = [], 
    isLoading: isUsersLoading, 
    isError: isUsersError 
  } = useAllUsers((e) => {
    const [username, provider] = e?.userName?.split('@') || [];
    return {
      ...e,
      username: username || '', // @ 앞의 값
      provider: provider || '', // @ 뒤의 값
    };
  });

  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <span>id = {selectedUser?.id || ''}</span>

      <TablesOuter
        columns={TableColumnsInfo.SETTING_USER}
        data={users}
        onRowClick={(row) => setSelectedUser(row)}
      />      
    </>
  );
};
  
export default SettingUsers;
