import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import {
  useAllDiskSnapshotsFromDomain,
  useAllTemplatesFromDomain,
  useAllVMsFromDomain,
  useDetachDomain,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainDetachModal
 * @description 
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainDetachModal = ({ 
  isOpen, 
  onClose
}) => {
  const {
    datacentersSelected, domainsSelected, sourceContext
  } = useGlobal()
  const title = sourceContext === "fromDomain" ? `${Localization.kr.DATA_CENTER}` : `${Localization.kr.DOMAIN}`;
  const label = sourceContext === "fromDomain"

  const onSuccess = () => {
    // onClose();
    toast.success(`${title} 분리 완료`);
  };
  const { mutate: detachDomain } = useDetachDomain(onSuccess);
  // const { mutate: detachDomain } = useDetachDomain(onSuccess, () => onClose());

  const { data: vms = [] } = useAllVMsFromDomain(domainsSelected[0]?.id, (e) => ({ ...e, }));
  const { data: templates = [] } = useAllTemplatesFromDomain(domainsSelected[0]?.id, (e) => ({ ...e }));
  const { data: diskSnapshots = [] } = useAllDiskSnapshotsFromDomain(domainsSelected[0]?.id, (e) => ({ ...e }));

  const transformedVmData = vms.map((vm) => ({ name: vm?.name }));
  const transformedTmpData = templates.map((vm) => ({ name: vm?.name }));
  const transformedSnapshotData = diskSnapshots.map((vm) => ({ name: vm?.name }));
    
  const handleFormSubmit = () => {
    onClose();
    detachDomain({ dataCenterId: datacentersSelected[0].id, domainId: domainsSelected[0]?.id });
  };

  return (
    <BaseModal targetName={title} submitTitle={"분리"}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`다음 ${label ? `${Localization.kr.DATA_CENTER}에서` : ""}  ${Localization.kr.DOMAIN}를 분리 하시겠습니까?`}
      contentStyle={{ width: "600px"}} 
      shouldWarn={true}
    >
      <div><b>{label ? datacentersSelected[0]?.name : domainsSelected[0]?.name}</b></div><br/>
      <div>분리 작업은 등록되지 않은 상태로 스토리지 도메인에 들어 있는 엔티티를 이동시킵니다.</div><br/>
      
      {transformedVmData.length > 0 && (
        <div>
          <div><b>가상머신 목록:</b></div>
          <ul>
            {transformedVmData.map((vm, idx) => (
              <li key={`vm-${idx}`}>{vm.name}</li>
            ))}
          </ul>
        </div>
      )}

      {transformedTmpData.length > 0 && (
        <div>
          <div><b>템플릿 목록:</b></div>
          <ul>
            {transformedTmpData.map((tmp, idx) => (
              <li key={`tmp-${idx}`}>{tmp.name}</li>
            ))}
          </ul>
        </div>
      )}

      {transformedSnapshotData.length > 0 && (
        <div>
          <div><b>디스크 스냅샷 목록:</b></div>
          <ul>
            {transformedSnapshotData.map((snap, idx) => (
              <li key={`snap-${idx}`}>{snap.name}</li>
            ))}
          </ul>
        </div>
      )}

      

      {/* TODO: 가상머신과 템플릿, 스냅샷이 있으면 경고문구를 보여줘야하는데 기준을 잡던가 해야됨요 */}
      {/* {!label && ( */}
        <div className="destroy-text"> 가상머신, 템플릿, 스냅샷이 있으면 안됨요.
          {Localization.kr.DOMAIN}에는 다른 {Localization.kr.DOMAIN}에 디스크가 있는 다음 VM/템플릿에 대한 리스가 포함되어 있습니다.
          {Localization.kr.DOMAIN} 제거를 진행하기 전에 해당 VM/템플릿 리스를 수동으로 제거하거나 이동하는 것을 고려해 주세요.
        </div>
      {/* )} */}

      <br/>
    </BaseModal>
  );
};

export default DomainDetachModal;
