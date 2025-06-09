import React, { useMemo } from "react";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import { ActionButtons }      from "@/components/button/ActionButtons";
import Localization           from "@/utils/Localization";

/**
 * @name SettingCertActionButtons
 * @description 인증서 관리 관련 액션버튼
 * 
 * @returns {JSX.Element} SettingCertActionButtons
 * 
 * @see ActionButtons
 **/
const SettingCertActionButtons = ({
  actionType="default",
}) => {
  const { setActiveModal } = useUIState();
  const { certsSelected } = useGlobal()

  const selected1st = [...certsSelected][0] ?? null

  const basicActions = [
    { type: "attach",      onClick: () => setActiveModal("cert:attach"),      label: Localization.kr.ATTACH,      disabled: certsSelected.length === 0 }, // 연결 disabled 조건 구하기 disabled: domainsSelected.length === 0 데이터센터가 없을때
  ];
 
  return (
    <>
      <ActionButtons actionType={actionType}
        actions={basicActions}
      />
    </>
  );
};

export default SettingCertActionButtons;
