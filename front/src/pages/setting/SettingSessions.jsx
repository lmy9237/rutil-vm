import React, { useCallback } from "react";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import SettingUserSessionsActionButtons from "./SettingUserSessionsActionButtons";
import {
  useAllUserSessions
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name SettingSessions
 * @description 관리 > 활성 사용자 세션
 *
 * @returns {JSX.Element} SettingSessions
 */
const SettingSessions = () => {
  const {
    usersessionsSelected, setUsersessionsSelected
  } = useGlobal()

  const {
    data: userSessions = [],
    isLoading: isUserSessionsLoading,
    isError: isUserSessionsError,
    isSuccess: isUserSessionsSuccess,
    refetch: refetchUserSessios,
    isRefetching: isUserSessionsRefetching,
  } = useAllUserSessions("");

  const transformedData = [...userSessions]?.map((session) => ({
    ...session
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isUserSessionsLoading} isRefetching={isUserSessionsRefetching} refetch={refetchUserSessios}
        />
        <LoadingFetch isLoading={isUserSessionsLoading} isRefetching={isUserSessionsRefetching} />
        <SettingUserSessionsActionButtons />
      </div>
      <TablesOuter target={"usersession"}
        columns={TableColumnsInfo.ACTIVE_USER_SESSION}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onRowClick={(row) => setUsersessionsSelected(row)}
        /*onClickableColumnClick={(row) => handleNameClick(row.id)}*/
        isLoading={isUserSessionsLoading} isRefetching={isUserSessionsRefetching} isError={isUserSessionsError} isSuccess={isUserSessionsSuccess}
      />
      <SelectedIdView items={usersessionsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.MANAGEMENT}>${Localization.kr.USER_SESSION}`}
        path={`sessions`}
      />
    </>
  );
};

export default SettingSessions;
