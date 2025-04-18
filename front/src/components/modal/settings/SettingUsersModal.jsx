import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import { useUser, useAddUser, useEditUser, useUpdatePasswordUser } from "../../../api/RQHook";
import LabelCheckbox from "../../label/LabelCheckbox";
import { validateUsername, validatePw } from "../../../util";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";
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
  editMode=false,
  changePassword=false,
  user, 
  onClose
}) => {
  const { usersSelected, setUsersSelected } = useGlobal()
  const [formState, setFormState] = useState(initialFormState);
  const {
    data: userFound
  } = useUser(user?.id ?? usersSelected[0]?.id)
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
  } = useUpdatePasswordUser(formState.username, formState.passwordCurrent, formState.password, true, (res) => {
    onClose();
  } , (err) => {
    onClose();
  });

  useEffect(() => {
    if (!isOpen || !(editMode || changePassword)) {
      return setFormState(initialFormState);
    }
    setUsersSelected(userFound)
    setFormState({ 
      ...initialFormState,
      id: userFound?.id,
      firstName: userFound?.firstName,
      surName: userFound?.surName,
      username: userFound?.username,
      disabled: userFound?.disabled,
      email: userFound?.email
    });
  }, [isOpen, editMode, changePassword, userFound])

  const handleFormSubmit = (e) => {
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

  Logger.debug("SettingUsersModal ...");
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"사용자"}
      submitTitle={editMode ? Localization.kr.UPDATE : changePassword ? "비밀번호 변경" : Localization.kr.CREATE}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}}
    >
      <div>
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
          <LabelCheckbox id="disabled" label="비활성화 여부"
            onChange={updateInputCheck("disabled")}
            checked={formState.disabled}
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
