import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteVm } from "../../../api/RQHook";
import ApiManager from "../../../api/ApiManager";
import "./MVm.css";

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
              toast.success("가상머신 삭제 성공");
              onClose();
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
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px", height: "260px" }} 
    >
      <div className="popup-content-outer">
        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon
              style={{ marginRight: "0.3rem" }}
              icon={faExclamationTriangle}
            />
            <span>선택한 가상머신을 삭제하시겠습니까?</span>
          </div>

          {ids.map((vmId, index) => (
            <div key={vmId} className="disk-delete-checkbox">
              <strong className="mr-2">{names[index]}</strong>
              <input
                type="checkbox"
                id={`diskDelete-${vmId}`}
                checked={detachOnlyList[vmId] || false}
                onChange={() => handleCheckboxChange(vmId)}
                disabled={!diskQueries[index]?.data?.length} // 디스크가 존재하지 않으면 disabled
              />
              <label htmlFor={`diskDelete-${vmId}`}>디스크 삭제</label>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default VmDeleteModal;
