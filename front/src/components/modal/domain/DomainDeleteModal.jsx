import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useAllHostFromDomain,
  useAllHosts,
  useDeleteDomain,
  useDestroyDomain,
} from "../../../api/RQHook";

const DomainDeleteModal = ({ isOpen, deleteMode = true, data, onClose }) => {
  const { mutate: deleteDomain } = useDeleteDomain();
  const { mutate: destroyDomain } = useDestroyDomain(); // 파괴를 여기서

  const [format, setFormat] = useState(false);
  const [hostName, setHostName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  // data가 배열 또는 단일 객체일 경우를 처리
  useEffect(() => {
    if (Array.isArray(data)) {
      setSelectedIds(data.map((item) => item.id));
      setSelectedNames(data.map((item) => item.name || item.alias || ""));
    } else if (data) {
      setSelectedIds([data.id]);
      setSelectedNames([data.name || data.alias || ""]);
    }
  }, [data]);

  // 해당 데이터센터가 가진 호스트 목록을 가져와야함
  const {
    data: hosts = [], 
    isLoading: isHostsLoading
  } = useAllHostFromDomain();

  useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostName(hosts[0].name); // 기본 호스트 이름 설정
    }
  }, [hosts]);

  const handleFormSubmit = () => {
    if (!selectedIds.length) {
      console.error("ID가 없습니다. 삭제 요청을 취소합니다.");
      return;
    }

    if (deleteMode) {
      selectedIds.forEach((id, index) => {
        deleteDomain(
          { domainId: id, format: format, hostName: hostName },
          {
            onSuccess: () => {
              if (index === selectedIds.length - 1) {
                toast.success("도메인 삭제 완료");
                onClose(); // 모든 삭제가 완료되면 모달 닫기
              }
            },
            onError: (error) => {
              toast.error(`도메인 ${selectedNames[index]} 삭제 오류:`, error);
            },
          }
        );
      });
    } else {
      // 파괴일때
      selectedIds.forEach((id, index) => {
        destroyDomain(id, {
          onSuccess: () => {
            if (index === selectedIds.length - 1) {
              toast.success("도메인 파괴 완료");
              onClose(); // 모든 삭제가 완료되면 모달 닫기
            }
          },
          onError: (error) => {
            toast.error(`도메인 ${selectedNames[index]} 삭제 오류:`, error);
          },
        });
      });
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스토리지 도메인"}
      submitTitle={deleteMode ? "삭제" : "파괴"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="domain-delete-popup modal"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span>
            {selectedNames.length > 1
              ? `${selectedNames.join(", ")} 를(을) ${deleteMode ? "삭제" : "파괴"}하시겠습니까?`
              : `${selectedNames[0]} 를(을) ${deleteMode ? "삭제" : "파괴"}하시겠습니까?`}
          </span>
        </div>
      </div>

      {deleteMode === true && (
        <div className="disk-delete-box" style={{ display: "flex" }}>
          <div className="flex">
            <input
              type="checkbox"
              id="format"
              checked={format}
              onChange={(e) => setFormat(e.target.checked)} // 체크 여부에 따라 true/false 설정
            />
            <label htmlFor="format">포맷 하시겠습니까?</label>
          </div>
          <div className="disk-delete-box">
            <select
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              disabled={!format} // format이 false면 비활성화
            >
              {hosts.map((host) => (
                <option key={host.id} value={host.name}>
                  {host.name} : {host.id}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default DomainDeleteModal;
