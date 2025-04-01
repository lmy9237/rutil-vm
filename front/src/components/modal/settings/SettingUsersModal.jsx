import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import { useAddUser, useEditUser, useChangePasswordUser } from "../../../api/RQHook";
import LabelCheckbox from "../../label/LabelCheckbox";
import { validateUsername, validatePw } from "../../../util";
import "./SettingsUserModal.css";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

const initialFormState = {
  id: "",
  firstName: "",
  surName: "",
  username: "",
  password: "",
  repassword: "",
  passwordCurrent: "",
  isDisabled: false,
};

const SettingUsersModal = ({ 
  isOpen,
  editMode = false,
  changePassword = false,
  user,
  onClose
}) => {
  const [formState, setFormState] = useState(initialFormState);
  const { 
    isLoading: isAddUserLoading,
    mutate: addUser,
  } = useAddUser({ ...formState }, (res) => {
    onClose();
  } , (err) => {
    onClose();
  });

  const {
    isLoading: isEditUserLoading, 
    mutate: editUser,
  } = useEditUser({ ...formState }, (res) => {
    onClose();
  } , (err) => {
    onClose();
  });

  const {
    isLoading: isChangePasswordLoading,
    mutate: changePasswordUser,
  } = useChangePasswordUser(formState.username, formState.passwordCurrent, formState.password, (res) => {
    onClose();
  } , (err) => {
  });

  useEffect(() => {
    if (!isOpen || !(editMode || changePassword)) {
      return setFormState(initialFormState);
    }
    setFormState({ ...user });
  }, [isOpen, editMode, changePassword, user])

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // 디스크 연결은 id값 보내기 생성은 객체로 보내기
    Logger.debug("SettingUsersModal > handleFormSubmit ... ");
    const error = validateForm(editMode);
    if (error) {
      toast.error(error);
      return;
    }

    if (editMode) editUser();
    else if (changePassword) changePasswordUser();
    else addUser();
  };

  const updateInput = (field) => (e) => {
    Logger.debug(`SettingUsersModal > updateInput ... field: ${field}`)
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateInputCheck = (field) => (e) => {
    Logger.debug(`SettingUsersModal > updateInputCheck ... field: ${field}`)
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const validateForm = (editMode) => {
    Logger.debug(`SettingUsersModal > validateForm ... editMode: ${editMode}`);
    let vUsername = validateUsername(formState.username);
    if (vUsername) return vUsername;
    let vPassword = validatePw(formState.password, formState.repassword);
    if (!editMode && vPassword) return vPassword;
    /* 추후 추가예정 */
    return null;
  };

  Logger.debug("...");
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"사용자"}
      submitTitle={editMode ? Localization.kr.UPDATE : changePassword ? "비밀번호 변경" : Localization.kr.CREATE}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px", height: "560px" }}
    >
      <div className="h-3/4 max-height-100 flex flex-col justify-center items-center">
        <LabelInput id="username" label="아이디(영문)"
          value={formState.username}
          onChange={updateInput("username", true)}
          disabled={editMode || changePassword}
          autoFocus
        />
        {!changePassword && (<LabelInput id="surName" label="성"
          value={formState.surName}
          onChange={updateInput("surName")}
          required={true}
        />)}
        {!changePassword && (
          <LabelInput id="firstName" 
            label={Localization.kr.NAME}
            value={formState.firstName}
            onChange={updateInput("firstName")}
            required={true}
          />
        )}
        {!changePassword && (
          <LabelCheckbox id="isDisabled" label="비활성화 여부"
            onChange={updateInputCheck("isDisabled")}
            checked={formState.isDisabled}
          />
        )}
        {editMode && (
          <LabelInput id="email" label="E-mail"
            value={formState.email}
            onChange={updateInput("email")}
          />)}
        {changePassword && (
          <LabelInput id="passwordCurrent" label="기존 비밀번호" type="password"
            onChange={updateInput("passwordCurrent")}
            required={true}
          />
        )}
        {(!editMode || changePassword) && (
          <LabelInput id="password" label="비밀번호" type="password"
            onChange={updateInput("password")}
            required={true}
          />
        )}
        {(!editMode || changePassword) && (
          <LabelInput id="repassword" label="비밀번호 (다시)" type="password"
            onChange={updateInput("repassword")}
            required={true}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default SettingUsersModal;
