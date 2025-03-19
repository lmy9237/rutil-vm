import { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useActivateDomain,
  useDetachDomain,
  useMaintenanceDomain,
} from "../../../api/RQHook";

/**
 * @name DomainActionModal
 * @description 도메인에서 실행하는 거지만 데이터센터
 * action으로 type 전달
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainActionModal = ({ isOpen, onClose, action, data, datacenterId }) => {
  const { mutate: detachDomain } = useDetachDomain();
  const { mutate: activateDomain } = useActivateDomain();
  const { mutate: maintenanceDomain } = useMaintenanceDomain();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [data]);

  const getContentLabel = () => {
    const labels = {
      detach: "분리",
      activate: "활성",
      maintenance: "유지보수",
    };
    return labels[action] || "";
  };

  const handleFormSubmit = () => {
    if (!ids.length) return toast.error("실행할 도메인이 없습니다.");

    const actionMap = {
      detach: detachDomain,
      activate: activateDomain,
      maintenance: maintenanceDomain,
    };
    const actionFn = actionMap[action];

    ids.forEach((domainId) => {
      actionFn(
        { domainId, dataCenterId: datacenterId },
        {
          onSuccess: () => {
            onClose();
            toast.success(`도메인 ${getContentLabel()} 완료`);
          },
          onError: (error) => {
            onClose();
            toast.error(`일부 도메인 ${getContentLabel()} 실패 ${error}`);
          },
        }
      );
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스토리지 도메인"}
      submitTitle={getContentLabel(action)}
      onSubmit={handleFormSubmit}
      shouldWarn={false}
      promptText={`${names.join(", ")} 를(을) ${getContentLabel(action)} 하시겠습니까?`}
      contentStyle={{ width: "630px", height: "200px" }} 
    />
  );
};

export default DomainActionModal;
