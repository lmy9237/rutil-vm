import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import { useAddBonding, useNetworkInterfaceFromHost } from "../../../api/RQHook";
import { checkName } from "../../../util";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";

const HostBondingModal = ({ 
  editmode = false, isOpen, onClose, 
  nicIds = []
}) => {
  const bLabel = editmode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.HOST} 본딩 ${bLabel} 완료`);
  };
  const { mutate: addBonding } = useAddBonding(onSuccess, () => onClose());
  const { data: hostNic = {} } = useNetworkInterfaceFromHost(hostId, editmode ? nicIds[0] : null);
  
  const [name, setName] = useState("");
  const [options, setOptions] = useState([]);
  const [option, setOption] = useState("");
  const [mode, setMode] = useState("");

  const initializeOptions = (bonding) => {
    if (!bonding?.bondingVo) return;
    setOptions(
      bonding.bondingVo.optionVos.map(option => ({
        name: option.name,
        value: option.value,
        type: option.type
      }))
    );
  };  
  
  useEffect(() => {
    if(!editmode){
      setName("");
      setOption();
    } else if (editmode && hostNic?.name) {
    setName(hostNic.name);
    initializeOptions(hostNic);
  }
}, [editmode, hostNic?.name]);

  const validateForm = () => {
    const nameError = checkName(name);
    if (nameError) return nameError;

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = { 
      name,
      bondingVo: {
        // optionVos: options,
        slaves: nicIds.map((nic) => ({ id: nic?.id }))
      }
     };

    Logger.debug(`Form Data: ${JSON.stringify(dataToSubmit, null, 2)}`); // 데이터 출력
    addBonding({ hostId: hostId, bonding: dataToSubmit })      
  };

  return (
    <BaseModal targetName={!editmode ? `새 본딩 ${Localization.kr.CREATE}` : `본딩 ${name} ${Localization.kr.UPDATE}`} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      onSubmit={() => ({})}
      // onSubmit={handleFormSubmit}
      contentStyle={{ width: "500px" }}
    >
      <span>nicids {editmode ? hostNic?.id : nicIds?.map((e) => `${e.id}, `)}</span>
      <LabelInput id="bonding_name" label="본딩이름"        
        value={name}
        disabled={editmode}
        onChange={(e) => setName(e.target.value)}
      />
      <LabelSelectOptions id="bonding_mode" label="본딩모드(우선mode고정)"        
        value={options.find(opt => opt.name === "mode")?.value || ""}
        options={optionList}
        disabled={editmode}
        onChange={(e) => {
          setOptions(prev => prev.map(opt => opt.name === "mode" ? { ...opt, value: e.target.value } : opt ));
        }}
      />
      <LabelInput id="user_mode" label="사용자 정의 모드"        
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      />
    </BaseModal>
  );
};

export default HostBondingModal;

const optionList = [
  { value: "1", label: "(Mode 1) Active-Backup" },
  { value: "2", label: "(Mode 2) Load balance (balance-xor)" },
  { value: "3", label: "(Mode 3) Broadcast" },
  { value: "4", label: "(Mode 4) Dynamic link aggregation (802.3ad)" }
];
