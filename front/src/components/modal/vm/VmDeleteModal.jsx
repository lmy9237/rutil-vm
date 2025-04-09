import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import BaseModal from "../BaseModal";
import { useDeleteVm } from "../../../api/RQHook";
import ApiManager from "../../../api/ApiManager";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";

const VmDeleteModal = ({ isOpen, onClose, data }) => {
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const [detachOnlyList, setDetachOnlyList] = useState({});

  const { mutate: deleteVm } = useDeleteVm();

  useEffect(() => {
    if (Array.isArray(data)) {
      const vmIds = data.map((item) => item.id);
      const vmNames = data.map((item) => item.name);
      setIds(vmIds);
      setNames(vmNames);
    } else if (data) {
      setIds([data.id]);
      setNames([data.name]);
    }
  }, [data]);

  const diskQueries = useQueries({
    queries: ids.map((vmId) => ({
      // queryKey: ["DisksFromVM", vmId],
      queryFn: async () => {
        try {
          const disks = await ApiManager.findDisksFromVM(vmId);
          return disks || []; // fallback to empty array
        } catch (error) {
          console.error(`Error fetching disks for VM ${vmId}`, error);
          return []; // fallback
        }
      }      
    })),
  });

  useEffect(() => {
    if (!diskQueries || !Array.isArray(diskQueries)) return;

    const newStates = {};
    diskQueries.forEach((query, index) => {
      const hasData = query?.data && Array.isArray(query.data) && query.data.length > 0;
      newStates[ids[index]] = hasData;
    });
    
    setDetachOnlyList((prevStates) => ({
      ...prevStates,
      ...newStates,
    }));
  }, [JSON.stringify(diskQueries), ids]);

  const handleCheckboxChange = (vmId) => {
    setDetachOnlyList((prevStates) => ({
      ...prevStates,
      [vmId]: !prevStates[vmId],
    }));
  };

  const handleFormSubmit = () => {
    if (!ids.length) {
      toast.error("삭제할 가상머신 ID가 없습니다.");
      return;
    }

    ids.forEach((vmId, index) => {
      Logger.debug(`가상머신 삭제 ${vmId} : ${detachOnlyList[vmId]}`);
      deleteVm(
        { vmId, detachOnly: detachOnlyList[vmId] },
        {
          onSuccess: () => {
            if (index === ids.length - 1) {
              onClose();
              toast.success("가상머신 삭제 성공");
            }
          },
          onError: (error) => {
            toast.error(`가상머신 삭제 오류: ${error.message}`);
          },
        }
      );
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"가상머신"}
      shouldWarn={true}
      // promptText={`${JSON.stringify(names.join(", "), null, 2)} 를(을) 삭제하시겠습니까?`}
      promptText={`다음 항목을 삭제하시겠습니까?`}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px"}} 
    >
      {ids?.map((vmId, index) => {
        const isDisabled = !diskQueries[index]?.data || !Array.isArray(diskQueries[index]?.data) || diskQueries[index].data.length === 0;
        return (
          <div key={vmId} className="disk-delete-checkbox f-btw">
            <div className="disk-delete-label">{names[index]}</div>
            <LabelCheckbox
              id={`diskDelete-${vmId}`}
              checked={detachOnlyList[vmId] || false}
              onChange={() => handleCheckboxChange(vmId)}
              disabled={isDisabled}
              label="디스크 삭제"
            />
          </div>
        );
      })}
    </BaseModal>
  );
};

export default VmDeleteModal;
