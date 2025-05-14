import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import BaseModal from "../BaseModal";
import { useDeleteVm } from "../../../api/RQHook";
import ApiManager from "../../../api/ApiManager";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";
import Localization from "../../../utils/Localization";

const VmDeleteModal = ({ isOpen, onClose, data }) => {
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${Localization.kr.REMOVE} 완료`);
  };
  const { mutate: deleteVm } = useDeleteVm(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || 'undefined'),
    };
  }, [data]);
  const [detachOnlyList, setDetachOnlyList] = useState({});

  const diskQueries = useQueries({
    queries: ids.map((vmId) => ({
      queryKey: ['DisksFromVM', vmId],
      queryFn: async () => {
        try {
          const disks = await ApiManager.findDisksFromVM(vmId);
          console.info(`disks *** ${vmId}`, disks);
          return disks.body || [];
        } catch (error) {
          console.error(`Error fetching disks for VM ${vmId}`, error);
          return [];
        }
      }
    })),
  });  
    
  useEffect(() => {
    if (!Array.isArray(diskQueries)) return;
  
    const isAllFetched = diskQueries.every(
      (query) => query.status === 'success' || query.status === 'error'
    );
  
    if (!isAllFetched) return;
  
    const newStates = {};
    ids.forEach((vmId, index) => {
      const disks = diskQueries[index]?.data || [];
      const hasDisks = Array.isArray(disks) && disks.length > 0;
      newStates[vmId] = hasDisks;
    });
  
    setDetachOnlyList((prev) => {
      const isSame = ids.every((id) => prev[id] === newStates[id]);
      return isSame ? prev : newStates;
    });
  }, [ids, diskQueries.map(q => q.status).join(), diskQueries.map(q => q.data?.length).join()]);
  

  const handleCheckboxChange = (vmId) => {
    setDetachOnlyList((prevStates) => ({ ...prevStates, [vmId]: !prevStates[vmId] }));
  };

  const handleFormSubmit = () => {
    if (!ids.length) { return toast.error("삭제할 가상머신이 없습니다.") }

    ids.forEach((vmId) => {
      Logger.debug(`가상머신 삭제 ${vmId} : ${detachOnlyList[vmId]}`);
      deleteVm({ vmId, detachOnly: detachOnlyList[vmId] });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.REMOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`다음 항목을 ${Localization.kr.REMOVE}하시겠습니까?`}
      contentStyle={{ width: "690px"}} 
      shouldWarn={true}
    >
      {ids?.map((vmId, index) => {
        const disks = diskQueries[index]?.data || [];
        const isDisabled = disks.length === 0;

        return (
          <div key={vmId} className="f-btw">
            <span className="fs-16 p-3.5 w-full">{names[index]}</span>
            <LabelCheckbox id={`diskDelete-${vmId}`} 
              label={`${Localization.kr.DISK} ${Localization.kr.REMOVE}`}               
              checked={detachOnlyList[vmId] || false}
              onChange={() => handleCheckboxChange(vmId)}
              disabled={isDisabled}
            />
          </div>
        );
      })}
    </BaseModal>
  );
};

export default VmDeleteModal;
