import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useRemoveUser } from "../../../api/RQHook";

const SettingUsersDeleteModal = ({ isOpen, onClose, data }) => {
  const {
    mutate: removeUser
  } = useRemoveUser();

  const {
    ids, 
    usernames
  } = useMemo(() => {
    if (!data) return { ids: [], names: [] };
  
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      usernames: dataArray.map((item) => item.username || "undefined"),
    };
  }, [data]);

  
  const handleFormSubmit = () => {
    console.log(`SettingUsersDeleteModal > handleFormSubmit ...`)
    if (!usernames.length) {
      toast.error("삭제할 사용자가 없습니다.");
      return;
    }

    usernames.forEach((username, i) => {
      removeUser(username, {
        onSuccess: () => {
          if (usernames.length === 1 || i === usernames.length - 1) {
            // 마지막 호스트 삭제 후 이동
            toast.success("사용자 삭제 성공");
            onClose(); // Modal 닫기
            // navigate('/computing/rutil-manager/hosts');
          }
        },
        onError: (error) => {
          toast.error(`사용자 삭제 오류:`, error);
        },
      });
    });

  }
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"사용자"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span>선택한 사용자 {usernames.join(", ")} 를(을) 삭제하시겠습니까?</span>
        </div>
      </div>
    </BaseModal>
  )
}

export default SettingUsersDeleteModal