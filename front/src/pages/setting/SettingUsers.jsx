import React, { useState, useEffect, Suspense } from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import SettingUsersModals from "../../components/modal/settings/SettingUsersModals"
import HeaderButton from '../../components/button/HeaderButton';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from '../../components/table/TablesOuter';
import { useAllUsers } from "../../api/RQHook";

/**
 * @name SettingUsers
 * @description 관리 > 사용자
 * 
 * @returns 
 */
const SettingUsers = () => {
  const { 
    data: users = [],
    isLoading: isUsersLoading, 
    isError: isUsersError,
    isSuccess: isUsersSuccess 
  } = useAllUsers((e) => {
    const [username, provider] = e?.userName?.split('@') || [];
    return {
      ...e,
      username: username || "", // @ 앞의 값
      provider: provider || "", // @ 뒤의 값
    };
  });
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const toggleModal = (type, isOpen) => {
    console.log(`SettingUsers > toggleModal ... type: ${type}, isOpen: ${isOpen}`);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [activePopup, setActivePopup] = useState(null);
  // const [modalTab, setModalTab] = useState('img'); // 모달 창 내 탭 관리
  useEffect(() => {
    console.log(`SettingUsers > useEffect ... selectedUser: ${JSON.stringify(selectedUser)}`);
    if (!Array.isArray(selectedUser)) {
      return;
    }
    setSelectedUserId(selectedUser[0].id)
  }, [selectedUser]);

  const openPopup = (popupType) => {
    console.log("SettingUsers > openPopup ... ")
    setActivePopup(popupType);
    if (popupType === "add") {
      setModals({create: true, edit:false, delete:false})
      return
    }
    if (popupType === "edit") {
      setModals({create: false, edit:true, delete:false})
      return
    }
    if (popupType === "remove") {
      setModals({create: false, edit:false, delete:true})
      return
    }
  };
  const closePopup = () => {
    console.log("SettingUsers > closePopup ... ")
    setActivePopup(null);
  }
  const buttons = [
    { id: 'btn-new', label: '생성', onClick: () => openPopup('add') },
    { id: 'btn-edit', label: '편집', onClick: () => openPopup('edit') },
    { id: 'btn-remove', label: '삭제', onClick: () => openPopup('remove') },
  ];

  const renderModals = () => {
    console.log("SettingUsers > renderModals ... ")
    return (
      <Suspense>
      {
        (modals.create || (modals.edit && selectedUser)) && (
          <SettingUsersModals 
            modalType={modals.create ? "create" : modals.edit ? "edit" : ""}
            onClose={() => toggleModal(modals.create ? "create" : "edit", false)}
          />
        )
      }
      {
        modals.delete && selectedUser && (
          {/* 제거 팝업 */}
          
        )
      }
      </Suspense>
    )
  }

  console.log("...")
  return (
    <div id="section">
      <div>
        <HeaderButton
          titleIcon={faUsers}
          title="사용자"
          buttons={buttons}
        />
      </div>
      <span>ID = { selectedUserId ?? ""}</span>
      <TablesOuter
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        columns={TableColumnsInfo.SETTING_USER}
        data={users}
        onRowClick={(row) => {
          console.log(`row selected ... id: ${row?.id}`)
          setSelectedUser(row)
        }}
      />
      
      {/* 모달창 */}
      {renderModals()}
    </div>
  );
};
  
export default SettingUsers;
