import { useState, useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import {
  useDeleteVm,
} from "@/api/RQHook";
import ApiManager                       from "@/api/ApiManager";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./MVm.css";

const VmDeleteModal = ({ 
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const { vmsSelected } = useGlobal()
  const {
    mutate: deleteVm
  } = useDeleteVm(onClose, onClose);

  const { ids, names } = useMemo(() => {
    if (!vmsSelected) return { ids: [], names: [] };
    
    return {
      ids: [...vmsSelected].map((item) => item.id),
      names: [...vmsSelected].map((item) => item.name || 'undefined'),
    };
  }, [vmsSelected]);
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

  const validateForm = () => {
    Logger.debug(`VmDeleteModal > validateForm ... `)
    if (!ids.length) return "삭제할 가상머신이 없습니다."
    return null
  }
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    Logger.debug(`VmDeleteModal > validateForm ... `)
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
