import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import { useNetworkInterfaceFromHost } from "../../../api/RQHook";
import { checkName } from "../../../util";
import Logger from "../../../utils/Logger";


const HostBondingModal = ({ 
  editmode = false, 
  isOpen, onClose,
  nicData = null,
  onBondingCreated
}) => {
  const { hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  const bLabel = editmode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { data: hostNic = {} } = useNetworkInterfaceFromHost(hostId, editmode ? nicData?.[0].id : null);
  
  const [name, setName] = useState("");
  // const [options, setOptions] = useState([]);
  // const [option, setOption] = useState("");
  // const [mode, setMode] = useState("");

  // const initializeOptions = (hostNic) => {
  //   if (!hostNic?.bondingVo) return;
  //   setOptions(
  //     hostNic.bondingVo.optionVos.map(option => ({
  //       name: option.name,
  //       value: option.value,
  //       type: option.type
  //     }))
  //   );
  // };  

  
  useEffect(() => {
    if(!editmode){
      setName("");
      // setOption();
    } else {
      setName(hostNic.name);
      // initializeOptions(hostNic);
    }
  }, [isOpen, editmode]);

  const validateForm = () => {
    const nameError = checkName(name);
    if (nameError) return nameError;

    return null;
  };

  const handleOkClick = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const newBonding = { 
      name,
      bondingVo: { slaves: nicData.map((nic) => ({ id: nic?.id })) }
    };

    Logger.debug(`handleFormSubmit ... dataToSubmit: `, newBonding); 
    onBondingCreated(newBonding, nicData); // nicData 추가 전달!
    onClose();
  };

  return (
    <BaseModal targetName={`본딩 ${bLabel}`} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleOkClick}
      contentStyle={{ width: "500px" }}
    >
      <span>nicdata{" "} {editmode ? hostNic?.id : nicData?.map((e) => `${e.id} /`).join("")}</span><br/>
      <span>network{" "} {editmode ? hostNic?.id : nicData?.map((nic) =>
        nic.networks?.map((network) => `${network.networkVo?.name || network.name}`).join(", ")
      ).join(" / ")}</span>

      {/* <span style={{ marginLeft: "4px", color: "#888", fontSize: "9px"}}>nicids {editmode ? hostNic?.id : nicData?.map((e) => `${e.id} /`)}</span> */}
      <LabelInput id="bonding_name" label={Localization.kr.NAME}        
        value={name}
        disabled={editmode}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelSelectOptions id="bonding_mode" label="본딩모드(편집가능)"        
        disabled={editmode}
        value={optionList[0].value}
        options={optionList}
        // value={options.find(opt => opt.name === "mode")?.value || ""}
        // options={optionList}
        // disabled={editmode}
        // onChange={(e) => {
        //   setOptions(prev => prev.map(opt => opt.name === "mode" ? { ...opt, value: e.target.value } : opt ));
        // }}
      />
      {/* <LabelInput id="user_mode" label="사용자 정의 모드"        
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      /> */}
    </BaseModal>
  );
};

export default HostBondingModal;

const optionList = [
  { value: "1", label: "(Mode 1) Active-Backup" },
  // { value: "2", label: "(Mode 2) Load balance (balance-xor)" },
  // { value: "3", label: "(Mode 3) Broadcast" },
  // { value: "4", label: "(Mode 4) Dynamic link aggregation (802.3ad)" }
];
