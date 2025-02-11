import React, { useState } from 'react';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import HeaderButton from '../../components/button/HeaderButton';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import TablesOuter from '../../components/table/TablesOuter';
import { useAllUsers } from "../../api/RQHook";
import { Modal } from 'storybook/internal/components';

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
      username: username || '', // @ 앞의 값
      provider: provider || '', // @ 뒤의 값
    };
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [modalTab, setModalTab] = useState('img'); // 모달 창 내 탭 관리

  const openPopup = (popupType) => {
    setActivePopup(popupType);
    if (popupType === 'newDisk') {
      setModalTab('img'); // 팝업 내 탭을 'img'로 설정
    }
  };

  const closePopup = () => setActivePopup(null);
  const buttons = [
    { id: 'btn-new', label: '생성', onClick: () => openPopup('add') },
    { id: 'btn-edit', label: '수정', onClick: () => openPopup('edit') },
    { id: 'btn-remove', label: '이동', onClick: () => openPopup('remove') },
  ];

  const renderModal = () => {
    {/* 생성 팝업 */}
    return (
      <Modal className="Modal"
        overlayClassName="Overlay"
        isOpen = {activePopup == 'add'}
        shouldCloseOnOverlayClick={false}
        onRequestClose={closePopup}
        contentLabel="사용자 생성성"
      >
      </Modal>
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
      <span>id = {selectedUser?.id || ''}</span>
      <TablesOuter
        isLoading={isUsersLoading} isError={isUsersError} isSuccess={isUsersSuccess}
        columns={TableColumnsInfo.SETTING_USER}
        data={users}
        onRowClick={(row) => setSelectedUser(row)}
      />
      {renderModal()}
    </div>
  );
};
  
export default SettingUsers;
