import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderButton from '../../../components/button/HeaderButton';
import Vnc from "../../../components/Vnc";
import { rvi24Desktop } from '../../../components/icons/RutilVmIcons';
import { useVmById } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./VmVnc.css"

/**
 * @name VmVnc
 * @description 가상머신 접속 VNC 페이지
 * #/vnc/<VM_ID>
 *  
 * @returns 
 */
const VmVnc = () => {
  const { 
    id: vmId,
  } = useParams();
  const { data: vm } = useVmById(vmId);
  const navigate = useNavigate();

  Logger.debug("...")
  return (
    <div className="section-vnc w-full h-full v-center">
      <HeaderButton titleIcon={rvi24Desktop("#F8F8F8")}
        title={vm?.name ?? "RutilVM에 오신걸 환영합니다."}
        status={Localization.kr.renderStatus(vm?.status)}
        inverseColor
      />
      <div className="section-vnc-content" 
      >
        <Vnc
          vmId={vmId}
          autoConnect={true}
        />
      </div>
    </div>
  );
}

export default VmVnc;
