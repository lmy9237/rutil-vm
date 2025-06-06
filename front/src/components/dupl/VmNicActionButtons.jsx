// import React, { useMemo } from "react";
// import useUIState from "@/hooks/useUIState";
// import useGlobal from "@/hooks/useGlobal";
// import { ActionButtons } from "@/components/button/ActionButtons";
// import Localization from "@/utils/Localization";

// /**
//  * @name VmNicActionButtons
//  * @description 가상머신 논리 네트워크 관련 액션버튼
//  * 
//  * @returns {JSX.Element} VmNicActionButtons
//  * 
//  * @see ActionButtons
//  */
// const VmNicActionButtons = ({
//   actionType = "default",
//   type ,
//   resourceId,  // ← 추가
// }) => {
//   const { setActiveModal } = useUIState();
//   const {
//     nicsSelected,
//     vnicProfilesSelected
//   } = useGlobal();

//   const isContextMenu = useMemo(() => actionType === "context", [actionType]);
//   const selected = type === "vm" ? nicsSelected : vnicProfilesSelected;

//   const basicActions = useMemo(() => ([
//     {
//       type: "create",
//       onClick: () => setActiveModal("nic:create"),
//       label: Localization.kr.CREATE,
//       disabled: isContextMenu && selected.length > 0,
//     },
//     {
//       type: "update",
//       onClick: () => setActiveModal("nic:update"),
//       label: Localization.kr.UPDATE,
//       disabled: selected.length !== 1,
//     },
//     {
//       type: "remove",
//       onClick: () => setActiveModal("nic:remove"),
//       label: Localization.kr.REMOVE,
//       disabled: selected.length === 0,
//     },
//   ]), [actionType, selected]);

//   return (
//     <ActionButtons
//       actionType={actionType}
//       actions={basicActions}
//     />
//   );
// };

// export default React.memo(VmNicActionButtons);

import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";

/**
 * @name VmNicActionButtons
 * @description 가상머신 논리 네트워크 관련 액션버튼
 * 
 * @returns {JSX.Element} VmNicActionButtons
 * 
 * @see ActionButtons
 */
const VmNicActionButtons = ({
  actionType="default",
}) => {
  const { setActiveModal } = useUIState()
  const { nicsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const selected1st = [...nicsSelected][0] ?? null
  const basicActions = useMemo(() => ([
    { type: "create", onClick: () => setActiveModal("nic:create"), label: Localization.kr.CREATE, disabled: isContextMenu && nicsSelected.length > 0, },
    { type: "update", onClick: () => setActiveModal("nic:update"), label: Localization.kr.UPDATE, disabled: nicsSelected.length !== 1, },
    { type: "remove", onClick: () => setActiveModal("nic:remove"), label: Localization.kr.REMOVE, disabled: nicsSelected.length === 0, },
  ]), [actionType, nicsSelected]);

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default React.memo(VmNicActionButtons);