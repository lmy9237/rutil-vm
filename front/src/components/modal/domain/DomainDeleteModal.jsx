import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useAllHosts,
  useDeleteDomain,
  useDestroyDomain,
} from "../../../api/RQHook";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import Localization from "../../../utils/Localization";
import LabelCheckbox from "../../label/LabelCheckbox";

const DomainDeleteModal = ({ isOpen, deleteMode = true, data, onClose }) => {
  const { mutate: deleteDomain } = useDeleteDomain();
  const { mutate: destroyDomain } = useDestroyDomain(); // 파괴를 여기서

  const [format, setFormat] = useState(false);
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  
  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [data]);

  // 해당 데이터센터가 가진 호스트 목록을 가져와야함
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
    if (!ids.length) return console.error(`삭제할 도메인 ID가 없습니다.`);

    if (deleteMode) {
      ids.forEach((id, index) => {
        deleteDomain(
          { domainId: id, format: format, hostName: hostVo.name },
          {
            onSuccess: () => {
              if (index === ids.length - 1) {
                onClose(); // 모든 삭제가 완료되면 모달 닫기
                toast.success("도메인 삭제 완료");
              }
            },
            onError: (error) => {
              toast.error(`도메인 ${names[index]} 삭제 오류:`, error);
            },
          }
        );
      });
    } else {
      // 파괴일때
      ids.forEach((id, index) => {
        destroyDomain(id, {
          onSuccess: () => {
            if (index === ids.length - 1) {
              onClose(); // 모든 삭제가 완료되면 모달 닫기
              toast.success("도메인 파괴 완료");
            }
          },
          onError: (error) => {
            toast.error(`도메인 ${names[index]} 삭제 오류:`, error);
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
      shouldWarn={true}
      promptText={
        <span>
          {names.length > 1
            ? `${names.join(", ")} 를(을) ${deleteMode ? "삭제" : "파괴"}하시겠습니까?`
            : `${names[0]} 를(을) ${deleteMode ? "삭제" : "파괴"}하시겠습니까?`}
        </span>
      }
      contentStyle={{ width: "670px" }}
    >
      {deleteMode === true && (
        <>
          <div style={{ display: "flex" }}>
            <LabelCheckbox
              id="format"
              label="포맷 하시겠습니까?"
              checked={format}
              onChange={(e) => setFormat(e.target.checked)}
            />
          </div>
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo}
            loading={isHostsLoading}
            options={hosts}
            onChange={(e) => {
              const selected = hosts.find(h => h.id === e.target.value);
              if (selected) setHostVo({ id: selected.id, name: selected.name });
            }}
          />
        </>
      )}
    </BaseModal>
  );
};

export default DomainDeleteModal;
