import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useAllHosts,
  useDeleteDomain,
} from "../../../api/RQHook";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import Localization from "../../../utils/Localization";
import LabelCheckbox from "../../label/LabelCheckbox";
import useGlobal from "../../../hooks/useGlobal";
import { handleSelectIdChange } from "../../label/HandleInput";

const DomainDeleteModal = ({ isOpen, onClose }) => {
  const { domainsSelected } = useGlobal()
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} ${Localization.kr.REMOVE} 완료`);
  };
  const { mutate: deleteDomain } = useDeleteDomain(onSuccess, () => onClose());
  
  const [format, setFormat] = useState(false);
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  
  // 해당 도메인의 데이터센터가 가진 호스트 목록을 가져와야함
  const {
    data: hosts = [], 
    isLoading: isHostsLoading
  } = useAllHosts((e) => ({ ...e }));

  useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostVo({id: hosts[0].id, name: hosts[0].name});
    }
  }, [hosts]);

  const handleFormSubmit = () => {
    deleteDomain(
      { domainId: domainsSelected[0]?.id, 
        format: format, 
        hostName: hostVo.name }
    );
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.REMOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      shouldWarn={true}
      promptText={`${domainsSelected[0]?.name} 를(을) ${Localization.kr.REMOVE} 하시겠습니까?`}
      contentStyle={{ width: "670px" }}
    >
      <div style={{ display: "flex" }}>
        <LabelCheckbox id="format" label="포맷 하시겠습니까?"
          checked={format}
          onChange={(e) => setFormat(e.target.checked)}
        />
      </div>
      <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
        value={hostVo.id}
        loading={isHostsLoading}
        options={hosts}
        disabled={!format}
        onChange={handleSelectIdChange(setHostVo, hosts)}
      />
    </BaseModal>
  );
};

export default DomainDeleteModal;
