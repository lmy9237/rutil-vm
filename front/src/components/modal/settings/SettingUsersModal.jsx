import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import { useAddUser } from "../../../api/RQHook";
import "./MSettingsUser.css";

const initialFormState = {
  id: "",
  username: "",
  password: "",
  repassword: "",
  name: "",
};

const SettingUsersModal = ({ isOpen, editMode = false, userId, onClose }) => {
  const [formState, setFormState] = useState(initialFormState);
  const { 
    isLoading: isAddUserLoading,
    mutate: addUser,
  } = useAddUser(formState.username, formState.password, (res) => {
    const msgSuccess = `SettingUsersModal > useAddUser > onSuccess ... `;
    console.info(msgSuccess);
    toast.success(`사용자 생성 완료`);
    onClose();
  }, (err) => {
    const msgErr = `SettingUsersModal > useAddUser > onError ... ${err}`;
    console.error(msgErr);
    toast.error(msgErr);
  });

  // const {
  //   mutate: editUser
  // } = useEditUser();

  useEffect(() => {
    if (!isOpen) {
      return setFormState(initialFormState);
    }
    if (editMode) {
      setFormState({
        // id: datacenter.id,
        // name: datacenter.name,
        // comment: datacenter.comment,
        // description: datacenter.description,
        // storageType: String(datacenter.storageType),
        // version: datacenter.version,
        // quotaMode: datacenter.quotaMode,
      });
    }
  }, [isOpen, editMode, userId])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // 디스크  연결은 id값 보내기 생성은 객체로 보내기
    console.log("SettingUsersModal > handleFormSubmit ... ");
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

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
      addUser();
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    console.log("SettingUsersModal > validateForm ... ");
    if (!formState.username) {
      return "아이디를 입력해주세요.";
    }
    if (formState.username.length < 4)  {
      return "아이디 길이가 짧습니다. (4자 이상)";
    }
    if (!formState.password) {
      return "비밀번호를 입력해주세요.";
    }
    if (formState.password.length < 4)  {
      return "비밀번호 길이가 짧습니다. (4자 이상)";
    }      
    /*
    추후 추가예정
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
      <div className="h-3/4 max-height-100 flex flex-col justify-center items-center">
        <LabelInput id="username" label="아이디(영문)"
          value={formState.username}
          onChange={handleInputChange("username")}
          autoFocus
        />
        <LabelInput id="name" label="이름"
          value={formState.name}
          onChange={handleInputChange("name")}
        />
        <LabelInput id="password" label="비밀번호" type="password"
          value={formState.password}
          onChange={handleInputChange("password")}
        />
        <LabelInput id="repassword" label="비밀번호 (다시)" type="password"
          value={formState.repassword}
          onChange={handleInputChange("repassword")}
        />
      </div>
    </BaseModal>
  );
};

export default SettingUsersModal;
