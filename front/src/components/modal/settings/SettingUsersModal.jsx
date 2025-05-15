import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import { handleInputChange, handleInputCheck } from "../../label/HandleInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import { validateUsername, validatePw } from "../../../util";
import { useUser, useAddUser, useEditUser, useUpdatePasswordUser } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./SettingsUserModal.css";

const initialFormState = {
  id: "",
  firstName: "",
  surName: "",
  username: "",
  password: "",
  repassword: "",
  passwordCurrent: "",
  disabled: false,
};

const SettingUsersModal = ({ 
  isOpen=false,
  onClose,
  editMode=false,
  changePassword=false,
  user, 
}) => {
  const { usersSelected, setUsersSelected } = useGlobal()
  const [formState, setFormState] = useState(initialFormState);
  const {
    data: userFound
  } = useUser(usersSelected[0]?.username ?? user?.username, true)
  
  const {
    isLoading: isAddUserLoading,
    mutate: addUser,
  } = useAddUser({ ...formState });

  const {
    isLoading: isEditUserLoading, 
    mutate: editUser,
  } = useEditUser({ ...formState });

  const {
    isLoading: isChangePasswordLoading,
    mutate: changePasswordUser,
  } = useUpdatePasswordUser(formState.username, formState.passwordCurrent, formState.password, true, onClose, onClose);

  useEffect(() => {
    if (!isOpen || !(editMode || changePassword)) {
      setFormState(initialFormState)
      return;
    }
    setUsersSelected(userFound)
    setFormState({ 
      id: userFound?.id,
      firstName: userFound?.firstName,
      surName: userFound?.surName,
      username: userFound?.username,
      disabled: userFound?.disabled,
      email: userFound?.email
    });
  }, [isOpen, editMode, changePassword, userFound])

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    Logger.debug("SettingUsersModal > handleFormSubmit ... ");
    const error = validateForm(editMode);
    if (error) {
      toast.error(error);
      return;
    }

    if (editMode) editUser();
    else if (changePassword) changePasswordUser();
    else addUser();
  }, [editMode, changePassword, formState]);

  const validateForm = useCallback((editMode) => {
    Logger.debug(`SettingUsersModal > validateForm ... editMode: ${editMode}`);
    let vUsername = validateUsername(formState.username);
    if (vUsername) return vUsername;
    let vPassword = validatePw(formState.password, formState.repassword);
    if (!editMode && vPassword) return vPassword;
    /* 추후 추가예정 */
    return null;
  }, [editMode, changePassword, formState]);

  return (
    <BaseModal targetName={Localization.kr.USER} submitTitle={editMode ? Localization.kr.UPDATE : changePassword ? "비밀번호 변경" : Localization.kr.CREATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "560px"}}
    >
      <form>
        <LabelInput id="username" label="아이디(영문)"
          value={formState.username}
          onChange={handleInputChange(setFormState, "username")}
          disabled={editMode || changePassword}
          required={true}
          autoFocus
        />
        {!changePassword && (<LabelInput id="surName" label="성"
          value={formState.surName}
          onChange={handleInputChange(setFormState, "surName")}
          required={true}
        />)}
        {!changePassword && (
          <LabelInput id="firstName" label={Localization.kr.NAME}
            value={formState.firstName}
            onChange={handleInputChange(setFormState, "firstName")}
            required={true}
          />
        )}
        {!changePassword && (
          <LabelCheckbox id="disabled" label="비활성화 여부"
            onChange={handleInputCheck(setFormState, "disabled")}
            checked={formState.disabled}
          />
        )}
        {editMode && (
          <LabelInput id="email" label="E-mail"
            value={formState.email}
            onChange={handleInputChange(setFormState, "email")}
          />)}
        {changePassword && (
          <LabelInput id="passwordCurrent" label="기존 비밀번호" type="password"
            onChange={handleInputChange(setFormState, "passwordCurrent")}
            required={true}
          />
        )}
        {(!editMode || changePassword) && (
          <LabelInput id="password" label="비밀번호" type="password"
            onChange={handleInputChange(setFormState, "password")}
            required={true}
          />
        )}
        {(!editMode || changePassword) && (
          <LabelInput id="repassword" label="비밀번호 (다시)" type="password"
            onChange={handleInputChange(setFormState, "repassword")}
            required={true}
          />
        )}
      </form>
    </BaseModal>
  );
};

export default SettingUsersModal;
