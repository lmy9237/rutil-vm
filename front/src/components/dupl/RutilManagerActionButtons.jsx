import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import useUIState             from "@/hooks/useUIState";
import useContextMenu         from "@/hooks/useContextMenu";
import useGlobal              from "@/hooks/useGlobal";
import { ActionButtons }      from "@/components/button/ActionButtons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

/**
 * @name RutilManagerActionButtons
 * @description RutilManager 관련 액션버튼
 * 
 * @prop {string} actionType
 * 
 * @returns {JSX.Element} RutilManagerActionButtons
 * 
 * @see ActionButtons
 */
const RutilManagerActionButtons = ({
  actionType="default"
}) => {
  const location = useLocation();
  const { clearAllContextMenu } = useContextMenu()
  const navigate = useNavigate();
  const isContextMenu = useMemo(() => actionType === "context", [actionType])
  
  const rootPath = useMemo(() => 
    location.pathname.split("/").slice(0, 2).join("/")
  , [location]) // '/computing' 또는 '/networks' 등 추출

  const basicActions = useMemo(() => [
    { type: "info",           label: Localization.kr.GENERAL,      onClick: () => handleTabClick("info") },
    { type: "datacenters",    label: Localization.kr.DATA_CENTER,  onClick: () => handleTabClick("datacenters") },
    { type: "clusters",       label: Localization.kr.CLUSTER,      onClick: () => handleTabClick("clusters") },
    { type: "hosts",          label: Localization.kr.HOST,         onClick: () => handleTabClick("hosts") },
    { type: "vms",            label: Localization.kr.VM,           onClick: () => handleTabClick("vms") },
    { type: "templates",      label: Localization.kr.TEMPLATE,     onClick: () => handleTabClick("templates") },
    { type: "storageDomains", label: Localization.kr.DOMAIN,       onClick: () => handleTabClick("storageDomains") },
    { type: "disks",          label: Localization.kr.DISK,         onClick: () => handleTabClick("disks") },
    { type: "networks",       label: Localization.kr.NETWORK,      onClick: () => handleTabClick("networks") },
    { type: "vnicProfiles",   label: Localization.kr.VNIC_PROFILE, onClick: () => handleTabClick("vnicProfiles") },
  ], [actionType]);
 
  const handleTabClick = (tab) => {
    clearAllContextMenu()
    const path = tab === "info"
        ? `${rootPath}/rutil-manager`
        : `${rootPath}/rutil-manager/${tab}`;
    navigate(path);
  };

  return (
    <ActionButtons actionType={actionType}
      actions={basicActions}
    />
  );
};

export default RutilManagerActionButtons;