import useGlobal                       from "@/hooks/useGlobal";
import BaseModal                       from "@/components/modal/BaseModal";
import { 
  RVI16, 
  rvi16ChevronRight
} from "@/components/icons/RutilVmIcons";
import {
  useAllDiskSnapshotsFromDomain,
  useAllTemplatesFromDomain,
  useAllVMsFromDomain,
  useDetachDomain,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import { useMemo } from "react";

/**
 * @name DomainDetachModal
 * @description 도메인 - 데이터센터 분리
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainDetachModal = ({ 
  isOpen, onClose,
}) => {
  const {
    datacentersSelected, domainsSelected, sourceContext
  } = useGlobal()
  const domainId = useMemo(() => [...domainsSelected][0]?.id, [domainsSelected]);
  const dataCenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);

  const title = sourceContext === "fromDomain" ? `${Localization.kr.DATA_CENTER}` : `${Localization.kr.DOMAIN}`;
  const label = sourceContext === "fromDomain"

  const { mutate: detachDomain } = useDetachDomain(onClose, onClose);

  const {
    data: vms=[],
    isLoading: isVmsLoading,
    isSuccess: isVmsSuccess,
  } = useAllVMsFromDomain(domainId, (e) => ({ ...e, }));
  const { 
    data: templates=[],
    isLoading: isTemplatesLoading,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplatesFromDomain(domainId, (e) => ({ ...e }));
  const { 
    data: diskSnapshots=[],
    isLoading: isDisksSnapshotsLoading,
    isSuccess: isDisksSnapshotsSuccess,
  } = useAllDiskSnapshotsFromDomain(domainId, (e) => ({ ...e }));

  const transformedVmData = [...vms].map((vm) => ({ name: vm?.name }));
  const transformedTmpData = [...templates].map((vm) => ({ name: vm?.name }));
  const transformedSnapshotData = [...diskSnapshots].map((vm) => ({ name: vm?.name }));
    
  const handleFormSubmit = () => {
    onClose();
    detachDomain({ dataCenterId, domainId });
  };

  return (
    <BaseModal targetName={title} submitTitle={Localization.kr.DETACH}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`다음 ${label ? `${Localization.kr.DATA_CENTER}에서` : ""}  ${Localization.kr.DOMAIN}를 ${Localization.kr.DETACH} 하시겠습니까?`}
      contentStyle={{ width: "650px"}} 
      // isReady={isVmsSuccess && isTemplatesSuccess && isDisksSnapshotsSuccess}
      shouldWarn={true}
    >
      <div className=" font-bold flex f-start">
        <RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/>
        {label ? datacentersSelected[0]?.name : domainsSelected[0]?.name}
      </div><br/>
     
      <hr/>
      <div className="flex py-4 associated-resource-lists">
        {transformedVmData.length > 0 && (
          <div>
            <div className="mb-2"><b>{Localization.kr.VM} 목록</b></div>
              
              {transformedVmData.map((vm, idx) => (
                <>
                <div className="mb-0.5">
                  <span className="mr-2 font-bold">-</span>
                  <span key={`vm-${idx}`}>{vm.name}</span>
                </div>
                </>
              ))}
           
          </div>
        )}

        {transformedTmpData.length > 0 && (
          <div>
            <div className="mb-2"><b>{Localization.kr.TEMPLATE} 목록</b></div>
            
              {transformedTmpData.map((tmp, idx) => (
                <>
                <div className="mb-0.5">
                  <span className="mr-2 font-bold">-</span>
                  <span key={`tmp-${idx}`}>{tmp.name}</span>
                </div>
                </>
              ))}
            
          </div>
        )}

        {transformedSnapshotData.length > 0 && (
          <div>
            <div className="mb-2"><b>{Localization.kr.DISK} {Localization.kr.SNAPSHOT} 목록</b></div>
           
              {transformedSnapshotData.map((snap, idx) => (
                <>
                <div className="mb-0.5">
                  <span className="mr-2 font-bold">-</span>
                  <span key={`snap-${idx}`}>{snap.name}</span>
                </div>
                </>
              ))}
           
          </div>
        )}
      </div>
      <br/>
      
      <div>분리 작업은 등록되지 않은 상태로 {Localization.kr.DOMAIN}에 들어 있는 엔티티를 이동시킵니다.</div><br/>
      {/* TODO: 가상머신과 템플릿, 스냅샷이 있으면 경고문구를 보여줘야하는데 기준을 잡던가 해야됨요 */}
      <div className="destroy-text"> 
        {Localization.kr.DOMAIN}에는 다른 {Localization.kr.DOMAIN}에 {Localization.kr.DISK}가 있는 다음 {Localization.kr.VM}/{Localization.kr.TEMPLATE}에 대한 리스가 포함되어 있습니다.<br/>
        {Localization.kr.DOMAIN} 제거를 진행하기 전에 해당 {Localization.kr.VM}/{Localization.kr.TEMPLATE} 리스를 수동으로 제거하거나 이동하는 것을 고려해 주세요.
      </div>

      <br/>
    </BaseModal>
  );
};

export default DomainDetachModal;
