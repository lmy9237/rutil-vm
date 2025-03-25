import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useAddTemplate,
  useAllDiskProfileFromDomain,
  useClustersFromDataCenter,
  useCpuProfilesFromCluster,
  useDisksFromVM,
  useDomainsFromDataCenter,
} from "../../../api/RQHook";
import "../vm/MVm.css";
import LabelInput from "../../label/LabelInput";
import Localization from "../../../utils/Localization";
import { checkName } from "../../../util";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";

const format = [
  { value: "RAW", label: "Raw" },
  { value: "COW", label: "Cow" },
];

const initialFormState = {
  name: "",
  description: "",
  comment: "",
  allowAllAccess: true,
  diskAlias: "",
  diskSize: "",
  diskFormat: "RAW",
  copyVmPermissions: false,  
};

const TemplateModal = ({ 
  isOpen, 
  onClose, 
  selectedVm, 
  // vmId 
}) => {
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });
  const [domainVo, setDomainVo] = useState({ id: "", name: "" });
  const [cpuProfileVo, setCpuProfileVo] = useState({ id: "", name: "" });

  const { mutate: addTemplate } = useAddTemplate();
   
  useEffect(() => {
    if (isOpen && selectedVm?.dataCenterVo?.id) {
      setDataCenterVo({
        id: selectedVm?.dataCenterVo?.id,
        name: selectedVm?.dataCenterVo?.name || "",
      });
    }
  }, [isOpen, selectedVm]);

  // 데이터센터 ID 기반으로 클러스터 목록 가져오기
  const { 
    data: clusters = [],
    isLoading: isClustersLoading
  } = useClustersFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));
  
  // 클러스터 ID 기반으로 CPU 프로파일 목록 가져오기
  const { 
    data: cpuProfiles = [],
    isLoading: isCpusLoading
  } = useCpuProfilesFromCluster(clusterVo.id || undefined, (e) => ({...e,}));

  // 가상머신에 연결되어있는 디스크
  const { 
    data: disks = [],
    isLoading: isDisksLoading
  } = useDisksFromVM(selectedVm?.id || undefined, (e) => ({ ...e }));

  // 데이터센터 ID 기반으로 스토리지목록 가져오기
  const { 
    data: domains = [],
    isLoading: isDomainsLoading
  } = useDomainsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({...e }));

  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading
  } = useAllDiskProfileFromDomain(domainVo.id || undefined, (e) => ({...e,}));
 
  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo({id: selectedVm?.dataCenterVo?.id});
      // setDomainVo({id:, name:})
      // setCpuProfileVo({id:, name:})
    }
  }, [isOpen]);

  useEffect(() => {
    if (clusters && clusters.length > 0) {
      setClusterVo({id: clusters[0].id, name: clusters[0].name});
    }
  }, [clusters]);

  useEffect(() => {
    if (cpuProfiles && cpuProfiles.length > 0) {
      setCpuProfileVo({id: cpuProfiles[0].id, name: cpuProfiles[0].name});
    }
  }, [cpuProfiles]);

  useEffect(() => {
    if (domains && domains.length > 0) {
      setDomainVo({id: domains[0].id, name: domains[0].name});
    }
  }, [domains]);
  

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    checkName(formState.name);

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    // 모든 디스크 데이터를 수집
    const disksToSubmit = disks.map((disk) => ({
      id: disk.diskImageVo?.id || "",
      size: disk.diskImageVo?.size || 0,
      alias: disk.diskImageVo?.alias || "",
      description: disk.diskImageVo?.description || "",
      format: disk.diskImageVo?.format || "RAW",
      sparse: disk.diskImageVo?.sparse || false,
      storageDomainVo: {
        id: disk.diskImageVo?.storageDomainVo?.id || "",
        name: disk.diskImageVo?.storageDomainVo?.name || "",
      },
      diskProfileVo: {
        id: disk.diskImageVo?.diskProfileVo?.id || "",
        name: disk.diskImageVo?.diskProfileVo?.name || "",
      },
    }));

    const dataToSubmit = {
      ...formState,
      clusterVo,
      cpuProfileVo,
      // vmVo: {
      //   id: vmId || "", // 가상머신 ID 추가
      //   name: selectedVm?.name || "",
      // },
      disks: disksToSubmit, // 모든 디스크 데이터를 포함
    };

    console.log("템플릿 생성데이터:", dataToSubmit);

    addTemplate( 
      { vmId: selectedVm.id, templateData: dataToSubmit },
      {
        onSuccess: () => {
          onClose();
          toast.success("템플릿 생성 완료");
        },
        onError: (error) => {
          toast.error("Error adding Template:", error);
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"템플릿"}
      submitTitle={"생성"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px"}} 
    >   
      <LabelInput id="name"
        label={Localization.kr.NAME}
        value={formState.name}
        onChange={handleInputChange("name")}
        autoFocus
      />
      <LabelInput id="description"
        label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange("description")}
      />
      <LabelInput id="comment"
        label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange("comment")}
      />
      <LabelSelectOptionsID id="cluster_select"
        label={`${Localization.kr.CLUSTER}`}
        value={clusterVo.id}
        options={clusters}
        onChange={(e) => {
          const selected = clusters.find(c => c.id === e.target.value);
          if (selected) setClusterVo({ id: selected.id, name: selected.name });
        }}
      />
      <LabelSelectOptionsID id="cpu_profile_select"
        label="CPU 프로파일"          
        value={cpuProfileVo.id}
        options={cpuProfiles}
        onChange={(e) => {
          const selected = cpuProfiles.find(cp => cp.id === e.target.value);
          if (selected) setCpuProfileVo({ id: selected.id, name: selected.name });
        }}
      />
  
      {disks && disks.length > 0 && (
        <>
          <div className="font-bold">디스크 할당:</div>
          <div className="section-table-outer py-1">
            <table>
              <thead>
                <tr>
                  <th>별칭</th>
                  <th>가상 크기</th>
                  <th>포맷</th>
                  <th>대상</th>
                  <th>디스크 프로파일</th>
                </tr>
              </thead>
              <tbody>
                {disks.map((disk, index) => (
                  <tr key={disk.id}>
                    <td>{disk.diskImageVo?.alias || "없음"}</td>
                    <td>
                      {(disk.diskImageVo?.virtualSize / 1024 ** 3 || 0).toFixed(
                        0
                      )}{" "}
                      GiB
                    </td>
                    <td>
                      <select
                        id={`format-${index}`}
                        value={disk.diskImageVo?.format || "RAW"} // 기본값 설정
                        onChange={(e) => {
                          const newFormat = e.target.value;
                          disks[index].diskImageVo.format = newFormat; // 디스크 데이터 업데이트
                          // setSelectedFormat(newFormat); // 상태 업데이트 (선택적)
                        }}
                      >
                        {format.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} {/* 화면에 표시될 한글 */}
                          </option>
                        ))}
                      </select>
                      <span>
                        {" "}
                        선택된 포맷: {disk.diskImageVo?.format || "RAW"}
                      </span>
                    </td>

                    {/* <td>
                      <select
                        value={disk.diskImageVo?.storageDomainVo?.id || ""}
                        onChange={(e) => {
                          const selectedStorage = storageFromDataCenter.find(
                            (storage) => storage.id === e.target.value
                          );
                          if (selectedStorage) {
                            disk.diskImageVo.storageDomainVo = {
                              id: selectedStorage.id,
                              name: selectedStorage.name,
                            };
                            setSelectedStorageId(selectedStorage.id);
                            setForceRender((prev) => !prev);
                          }
                        }}
                      >
                        {storageFromDataCenter &&
                          storageFromDataCenter.map((storage) => (
                            <option key={storage.id} value={storage.id}>
                              {storage.name}
                            </option>
                          ))}
                      </select>
                    </td> */}

                    {/* <td>
                      {selectedStorageId && diskProfiles ? (
                        <select
                          value={disk.diskImageVo?.diskProfileVo?.id || ""}
                          onChange={(e) => {
                            const selectedProfile = diskProfiles.find(
                              (profile) => profile.id === e.target.value
                            );
                            if (selectedProfile) {
                              disk.diskImageVo.diskProfileVo = {
                                id: selectedProfile.id,
                                name: selectedProfile.name,
                              };
                              setForceRender((prev) => !prev);
                            }
                          }}
                        >
                          {diskProfiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                              {profile.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>디스크 프로파일을 로드 중입니다...</span>
                      )}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {!disks || disks.length === 0 ? (
        <div className="font-bold">연결된 디스크 데이터가 없습니다.</div>
      ) : null}

      {/* <LabelCheckbox
        id="allow_all_access"
        label="모든 사용자에게 이 템플릿 접근을 허용"
        checked={formState.allowAllAccess}
        onChange={() => setAllowAllAccess(!allowAllAccess)}
      /> */}

      <ToggleSwitchButton
        label="모든 사용자에게 이 템플릿 접근을 허용"
        checked={formState.allowAllAccess}
        onChange={() => setFormState((prev) => ({...prev, allowAllAccess: !formState.allowAllAccess }))}
        tType={"네"} fType={"아니요"}
      />
      
      <ToggleSwitchButton
        label={`${Localization.kr.VM} 권한 복사`}
        checked={formState.copyVmPermissions}
        onChange={() => setFormState((prev) => ({...prev, copyVmPermissions: !formState.copyVmPermissions }))}
        tType={"네"} fType={"아니요"}
      />

      {/* <LabelCheckbox
        id="copy_vm_permissions"
        label={`${Localization.kr.VM} 권한 복사`}
        checked={formState.}
        onChange={() => setCopyVmPermissions(!copyVmPermissions)}
      /> */}

    </BaseModal>
  );
};

export default TemplateModal;
