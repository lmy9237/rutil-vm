import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteVm } from "../../../api/RQHook";
import ApiManager from "../../../api/ApiManager";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";

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
      queryKey: ["DisksFromVM", vmId],
      queryFn: async () => {
        console.log(`Fetching disks for VM: ${vmId}`);
        return await ApiManager.findDisksFromVM(vmId);
      },
      enabled: !!vmId,
    })),
  });

  useEffect(() => {
    if (!diskQueries.length) return;

    const newStates = {};
    diskQueries.forEach(({ data }, index) => {
      newStates[ids[index]] = data && data.length > 0; // 디스크가 있으면 true
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
      console.log(`가상머신 삭제 ${vmId} : ${detachOnlyList[vmId]}`);
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
      promptText={`${JSON.stringify(names.join(", "), null, 2)} 를(을) 삭제하시겠습니까?`}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px", height: "260px" }} 
    >
    
    
          {ids.map((vmId, index) => (
            <div key={vmId} className="disk-delete-checkbox f-btw">
              <div className="disk-delete-label">{names[index]}</div>
              <LabelCheckbox
                id={`diskDelete-${vmId}`}
                checked={detachOnlyList[vmId] || false}
                onChange={() => handleCheckboxChange(vmId)}
                disabled={!diskQueries[index]?.data?.length}
                label="디스크 삭제"
              />
            </div>
          ))}
      

    </BaseModal>
  );
};

export default VmDeleteModal;
