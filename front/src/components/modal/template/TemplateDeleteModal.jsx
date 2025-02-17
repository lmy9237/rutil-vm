import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteTemplate } from "../../../api/RQHook";

const TemplateDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutate: deleteTemplate } = useDeleteTemplate();

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
    if (!ids.length) {
      console.error("삭제할 템플릿 ID가 없습니다.");
      return;
    }

    ids.forEach((templateId, index) => {
      deleteTemplate(templateId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            // 마지막 템플릿 삭제 후 이동
            onClose();
            navigate("/computing/templates");
          }
        },
        onError: (error) => {
          console.error(`템플릿 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"템플릿"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
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

export default TemplateDeleteModal;
