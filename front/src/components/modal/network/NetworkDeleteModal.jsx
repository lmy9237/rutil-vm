import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteNetwork } from "../../../api/RQHook";

const NetworkDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutate: deleteNetwork } = useDeleteNetwork();

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.id);
      const names = data.map((item) => item.name); // name이 없는 경우 처리
      setIds(ids);
      setNames(names);
    } else if (data) {
      setIds([data.id]);
      setNames([data.name]);
    }
  }, [data]);

  const handleFormSubmit = () => {
    // 삭제할 네트워크에 호스트나 뭐가 붙어잇으면 삭제불가능
    if (!ids.length) {
      console.error("삭제할 네트워크 ID가 없습니다.");
      return;
    }

    ids.forEach((networkId, index) => {
      deleteNetwork(networkId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            // 마지막 네트워크 삭제 후 이동
            onClose(); // Modal 닫기
            navigate("/networks");
          }
        },
        onError: (error) => {
          console.error(`네트워크 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"네트워크"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default NetworkDeleteModal;
