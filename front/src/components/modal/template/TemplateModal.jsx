import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useAddTemplate,
  useClustersFromDataCenter,
  useCpuProfilesFromCluster,
  useDisksFromVM,
  useDomainsFromDataCenter,
} from "../../../api/RQHook";
import "../vm/MVm.css";
import LabelInput from "../../label/LabelInput";
import Localization from "../../../utils/Localization";
import { checkName, checkZeroSizeToGiB } from "../../../util";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import Logger from "../../../utils/Logger";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { useQueries } from "@tanstack/react-query";
import ApiManager from "../../../api/ApiManager";

const formats = [
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
  // diskFormat: "RAW",
  copyVmPermissions: false,
};


const TemplateModal = ({
  isOpen,
  onClose,
  selectedVm,
}) => {
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });
  const [cpuProfileVo, setCpuProfileVo] = useState({ id: "", name: "" });

  const [diskVoList, setDiskVoList] = useState([]);
  const [diskProfilesList, setDiskProfilesList] = useState([]);
  
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.TEMPLATE} 생성 완료`);
  };
  const { mutate: addTemplate } = useAddTemplate(onSuccess, () => onClose());

  // 데이터센터 ID 기반으로 클러스터 목록 가져오기
  const {
    data: clusters = [],
    isLoading: isClustersLoading
  } = useClustersFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  // 클러스터 ID 기반으로 CPU 프로파일 목록 가져오기
  const {
    data: cpuProfiles = [],
    isLoading: isCpuProfilesLoading
  } = useCpuProfilesFromCluster(clusterVo.id, (e) => ({ ...e, }));

  // 가상머신에 연결되어있는 디스크
  const {
    data: disks = [],
  } = useDisksFromVM(selectedVm?.id, (e) => ({ ...e }));

  // 데이터센터 ID 기반으로 스토리지목록 가져오기
  const {
    data: domains = [],
    isLoading: isDomainsLoading
  } = useDomainsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  const getDiskProfiles = useQueries({
    queries: domains.map((domain) => ({
      queryKey: ['DisksFromVM', domain.id],
      queryFn: async () => {
        try {
          const diskProfiles = await ApiManager.findAllDiskProfilesFromDomain(domain.id);
          return diskProfiles || [];
        } catch (error) {
          console.error(`Error fetching ${domain}`, error);
          return [];
        }
      }
    })),
  });  

  Logger.debug(`TemplateModal > domains: `, domains);
  Logger.debug(`TemplateModal > disks: `, disks);

  useEffect(() => {
    if (isOpen && selectedVm?.dataCenterVo?.id) {
      setDataCenterVo({
        id: selectedVm?.dataCenterVo?.id,
        name: selectedVm?.dataCenterVo?.name || "",
      });
      setFormState((prev) => ({
        ...prev, name: `${selectedVm?.name || ""}_temp`
      }));
    }
  }, [isOpen, selectedVm]);

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo({ id: selectedVm?.dataCenterVo?.id });
    }
  }, [isOpen]);

  useEffect(() => {
    if (clusters && clusters.length > 0) {
      const defaultC = clusters.find(c => c.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultC) {
        setClusterVo({ id: defaultC.id, name: defaultC.name });
      } else {
        setClusterVo({ id: clusters[0].id, name: clusters[0].name });
      }
    }
  }, [clusters]);

  useEffect(() => {
    if (cpuProfiles && cpuProfiles.length > 0) {
      setCpuProfileVo({ id: cpuProfiles[0].id, name: cpuProfiles[0].name });
    }
  }, [cpuProfiles]);

  useEffect(() => {
    if (disks && disks.length > 0) {
      setDiskVoList(
        disks.map((disk) => ({
          ...disk,
          diskImageVo: {
            ...disk.diskImageVo,
            format: disk.diskImageVo?.format || "RAW",
            storageDomainVo: disk.diskImageVo?.storageDomainVo || { id: "", name: "" },
            diskProfileVo: disk.diskImageVo?.diskProfileVo || { id: "", name: "" },
          },
        }))
      );
    }
  }, [disks]);

  // useEffect로 getDiskProfiles 결과를 정리하여 diskProfilesList 업데이트
  useEffect(() => {
    const newDiskProfilesMap = {};
  
    getDiskProfiles.forEach((queryResult, idx) => {
      const domain = domains[idx];
      if (domain && queryResult.data && !queryResult.isLoading) {
        newDiskProfilesMap[domain.id] = queryResult.data.body || [];
      }
    });
  
    // 기존 값과 다를 때만 업데이트
    const isDifferent = JSON.stringify(diskProfilesList) !== JSON.stringify(newDiskProfilesMap);
    if (isDifferent) {
      setDiskProfilesList(newDiskProfilesMap);
    }
  }, [getDiskProfiles, domains]); 

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectIdChange = (setVo, voList) => (e) => {
    const selected = voList.find((item) => item.id === e.target.value);
    if (selected) setVo({ id: selected.id, name: selected.name });
  };


  const handleDiskChange = (index, field, value, nested = false) => {
    setDiskVoList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        diskImageVo: {
          ...updated[index].diskImageVo,
          ...(nested
            ? { [field]: { id: value.id, name: value.name } }
            : { [field]: value }),
        },
      };      
      return updated;
    });
  };

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      clusterVo,
      cpuProfileVo,
      vmVo: { id: selectedVm.id, name: selectedVm?.name },

      diskAttachmentVos: diskVoList.map((disk) => ({
        diskImageVo: {
          id: disk.diskImageVo?.id,
          alias: disk.diskImageVo?.alias,
          format: disk.diskImageVo?.format,
          storageDomainVo: disk.diskImageVo?.storageDomainVo,
          diskProfileVo: disk.diskImageVo?.diskProfileVo,
        },
      })),
    };

    Logger.debug(`TemplateModal > dataToSubmit ... 템플릿 생성데이터: ${dataToSubmit}`);

    addTemplate({ vmId: selectedVm.id, templateData: dataToSubmit });
  };

  return (
    <BaseModal targetName={`${Localization.kr.TEMPLATE}`} submitTitle={Localization.kr.CREATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px" }}
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        value={formState.name}
        autoFocus
        onChange={handleInputChange("name")}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange("description")}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange("comment")}
      />
      <LabelSelectOptionsID id="cluster_select" label={`${Localization.kr.CLUSTER}`}
        loading={isClustersLoading}
        value={clusterVo.id}
        options={clusters}
        onChange={handleSelectIdChange(setClusterVo, clusters)}
      />
      <LabelSelectOptionsID id="cpu_profile_select" label="CPU 프로파일"
        loading={isCpuProfilesLoading}
        value={cpuProfileVo.id}
        options={cpuProfiles}
        onChange={handleSelectIdChange(setCpuProfileVo, cpuProfiles)}
      />

      {disks && disks.length > 0 && (
        <>
          <div className="font-bold">디스크 할당</div>
          <div className="section-table-outer py-1">
            <table>
              <thead>
                <tr>
                  <th>{Localization.kr.ALIAS}</th>
                  <th style={{width:'10%'}}>가상 크기</th>
                  <th style={{width:'10%'}}>포맷</th>
                  <th>{Localization.kr.TARGET}</th>
                  <th>디스크 프로파일</th>
                </tr>
              </thead>
              <tbody>
                {diskVoList.map((disk, index) => (
                  <tr key={disk.id}>
                    <td>
                      <LabelInput label={""}
                        value={disk.diskImageVo?.alias || ""}
                        onChange={(e) => handleDiskChange(index, "alias", e.target.value)}
                      />
                    </td>
                    <td>{checkZeroSizeToGiB(disk.diskImageVo?.virtualSize)}</td>
                    <td>
                      <LabelSelectOptions
                        id={`diskFormat-${index}`}
                        value={disk.diskImageVo?.format}
                        options={formats}
                        onChange={(e) => handleDiskChange(index, "format", e.target.value)}
                      />
                    </td>
                    <td>
                      <LabelSelectOptionsID
                        value={disk.diskImageVo?.storageDomainVo?.id}
                        loading={isDomainsLoading}
                        options={domains.filter((d) => d.status === "ACTIVE")}
                        onChange={(e) => {
                          const selected = domains.find(d => d.id === e.target.value);
                          if (selected) {
                            handleDiskChange(index, "storageDomainVo", selected, true);
                            const newProfiles = diskProfilesList[selected.id] || [];
                            if (newProfiles.length > 0) {
                              handleDiskChange(index, "diskProfileVo", newProfiles[0], true);
                            }
                          }
                        }}                        
                      />
                      {(() => {
                        const selected = domains.find(d => d.id === disk.diskImageVo?.storageDomainVo?.id);
                        return selected ? (
                          <div className="text-xs text-gray-500 mt-1">
                            사용 가능: {checkZeroSizeToGiB(selected.availableSize)} /
                            총 용량: {checkZeroSizeToGiB(selected.diskSize)}
                          </div>
                        ) : null;
                      })()}
                    </td>
                    <td>
                      <LabelSelectOptionsID
                        value={disk.diskImageVo?.diskProfileVo?.id}
                        loading={false}
                        options={diskProfilesList[disk.diskImageVo?.storageDomainVo?.id] || []}
                        onChange={(e) => {
                          const selected = (diskProfilesList[disk.diskImageVo?.storageDomainVo?.id] || []).find(d => d.id === e.target.value);
                          if (selected) handleDiskChange(index, "diskProfileVo", selected, true);
                        }}
                      />
                    </td>
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

      <ToggleSwitchButton
        label="모든 사용자에게 이 템플릿 접근을 허용"
        checked={formState.allowAllAccess}
        onChange={() => setFormState((prev) => ({ ...prev, allowAllAccess: !formState.allowAllAccess }))}
        tType={"네"} fType={"아니요"}
      />
      <ToggleSwitchButton
        label={`${Localization.kr.VM} 권한 복사`}
        checked={formState.copyVmPermissions}
        onChange={() => setFormState((prev) => ({ ...prev, copyVmPermissions: !formState.copyVmPermissions }))}
        tType={"네"} fType={"아니요"}
      />
    </BaseModal>
  );
};

export default TemplateModal;
