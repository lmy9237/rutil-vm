import Logger from "../../../utils/Logger";

/**
 * @name SettingUserSessionsModal
 * @description 관리 > 활성 사용자 세션 모달
 * 
 * @returns 
 */
const SettingUserSessionsModal = ({
  modalType
  , userSession
  , onClose
}) => {
  Logger.debug("SettingUserSessionsModal ...")
  return (
    <>
    {/* <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"사용자"}
      submitTitle={editMode ? Localization.kr.UPDATE : Localization.kr.CREATE}
      onSubmit={handleFormSubmit}
    >
    </BaseModal> */}
    </>
  );
}

export default SettingUserSessionsModal