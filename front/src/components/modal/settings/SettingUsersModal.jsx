import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useAddUser } from "../../../api/RQHook";
import "./MSettingsUser.css";

const initialUserForm = {
  id: "",
  password: "",
  name: "",
};

const SettingUsersModal = ({ isOpen, editMode = false, userId, onClose }) => {
  const { 
    mutate: addUser
  } = useAddUser();

  // const {
  //   mutate: editUser
  // } = useEditUser();

  const [userForm, setUserForm] = useState(initialUserForm);

  const userData2Submit = {
    id: "",
    password: "",
    name: ""
  }

  const handleFormSubmit = () => {
    // 디스크  연결은 id값 보내기 생성은 객체로 보내기
    console.log("SettingUsersModal > handleFormSubmit ... ");
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    console.log("가상머신 데이터 확인:", userData2Submit);

    if (editMode) {
      /*
      editUser(
        { userId: userId, vmdata: userData2Submit },
        {
          onSuccess: () => {
            onClose();
            toast.success("가상머신 편집 완료");
          },
          onError: (error) => toast.error("Error editing vm:", error),
        }
      );
      */
    } else {
      addUser(userData2Submit, {
        onSuccess: () => {
          onClose();
          toast.success("가상머신 생성 완료");
        },
        onError: (error) => toast.error("Error adding vm:", error),
      });
    }
  };

  const validateForm = () => {
    console.log("SettingUsersModal > validateForm ... ");
    /*
    if (!formInfoState.name) return "이름을 입력해주세요.";
    if (!clusterVoId) return "클러스터를 선택해주세요.";
    if (formSystemState.memorySize > "9223372036854775807")
      return "메모리 크기가 너무 큽니다.";
    */
    return null;
  };

  console.log("...");
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"사용자"}
      submitTitle={editMode ? "편집" : "생성"}
      onSubmit={handleFormSubmit}
    >
      <div className="vm_edit_popup_content flex"></div>
    </BaseModal>
  );
};

export default SettingUsersModal;
