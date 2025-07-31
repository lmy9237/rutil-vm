import { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { 
  handleInputChange, 
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import {
  useAddTemplate,
  useAllTemplates,
  useClustersFromDataCenter,
  useCpuProfilesFromCluster,
  useAllDiskAttachmentsFromVm,
  useAllActiveDomainsFromDataCenter,
  useAllDiskProfilesFromDomain4EachDomain,
} from "@/api/RQHook";
import { 
  checkDuplicateName, 
  checkName, 
  checkZeroSizeToGiB, 
  emptyIdNameVo,
  useSelectFirstNameItemEffect
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "../vm/MVm.css";

const initialFormState = {
  name: "",
  description: "",
  comment: "",
  allowAllAccess: true,
  diskAlias: "",
  Size: "",
  copyVmPermissions: false,
};

const TemplateModal = ({
  isOpen, onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal()
  const vmSelected = useMemo(() => vmsSelected[0], [vmsSelected])
  
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());
  const [cpuProfileVo, setCpuProfileVo] = useState(emptyIdNameVo());

  const [diskVoList, setDiskVoList] = useState([]);
  const [diskProfilesList, setDiskProfilesList] = useState([]);
  
  const { mutate: addTemplate } = useAddTemplate(onClose, onClose);

  const { data: templates = [] } = useAllTemplates();
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

  const { 
    data: disks = [],
  } = useAllDiskAttachmentsFromVm(vmSelected?.id, (e) => ({ ...e }));

  
  const { /* 데이터센터 별 스토리지 도메인 목록 */
    data: domains = [],
    isLoading: isDomainsLoading
  } = useAllActiveDomainsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));


  const qr = useAllDiskProfilesFromDomain4EachDomain(domains, (e) => ({ ...e }));
  
  const isQrSuccess = useMemo(() => {
    return qr.every((q) => q?.isSuccess);
  }, [qr]);
  
  useSelectFirstNameItemEffect(clusters, setClusterVo, "Default");
  useSelectFirstNameItemEffect(cpuProfiles, setCpuProfileVo, "Default");


  useEffect(() => {
    if (isOpen && vmSelected?.dataCenterVo?.id) {
      setDataCenterVo({
        id: vmSelected?.dataCenterVo?.id,
        name: vmSelected?.dataCenterVo?.name || "",
      });
      setFormState((prev) => ({
        ...prev, 
        name: `${vmSelected?.name || ""}_temp`
      }));
    }
  }, [isOpen, vmsSelected]);


  useEffect(() => {
    if (disks && disks.length > 0) {
      setDiskVoList(
        disks.map((disk) => ({
          ...disk,
          diskImageVo: {
            ...disk.diskImageVo,
            format: "cow",
            // format: disk.diskImageVo?.format || "cow",
            storageDomainVo: disk.diskImageVo?.storageDomainVo || emptyIdNameVo(),
            diskProfileVo: disk.diskImageVo?.diskProfileVo || emptyIdNameVo(),
          },
        }))
      );
    }
  }, [disks]);

  useEffect(() => {
    if (!domains || domains.length === 0 || !isQrSuccess) return;

    const map = {};
    qr.forEach((query, index) => {
      const domain = domains[index];
      if (domain?.id && query?.data) {
        map[domain.id] = query.data;
      }
    });
    setDiskProfilesList(map);
  }, [qr, domains, isQrSuccess]);

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
    const duplicateError = checkDuplicateName(templates, formState.name, formState.id);
    if (duplicateError) return duplicateError;

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formState,
      clusterVo,
      cpuProfileVo,
      vmVo: { id: vmSelected?.id, name: vmSelected?.name },

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

    Logger.debug(`TemplateModal > dataToSubmit ... dataToSubmit: `, dataToSubmit);
    addTemplate({ vmId: vmSelected.id, templateData: dataToSubmit });
  };

  return (
    <BaseModal targetName={Localization.kr.TEMPLATE} submitTitle={Localization.kr.CREATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px" }}
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        value={formState.name}
        autoFocus
        onChange={handleInputChange(setFormState, "name",validationToast)}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange(setFormState, "description",validationToast)}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange(setFormState, "comment", validationToast)}
      />
      <LabelSelectOptionsID id="cluster_select" label={`${Localization.kr.CLUSTER}`}
        loading={isClustersLoading}
        value={clusterVo.id}
        options={clusters}
        onChange={handleSelectIdChange(setClusterVo, clusters, validationToast)}
      />
      <LabelSelectOptionsID id="cpu_profile_select" label={Localization.kr.CPU_PROFILE}
        loading={isCpuProfilesLoading}
        value={cpuProfileVo.id}
        options={cpuProfiles}
        onChange={handleSelectIdChange(setCpuProfileVo, cpuProfiles, validationToast)}
      />
      <hr/><br/>

      {disks && disks.length > 0 && (
        <>
          <div className="font-bold">{Localization.kr.DISK} 할당</div>
            <div className="section-table-outer py-1">
              <table>
                <thead>
                  <tr>
                    <th>{Localization.kr.ALIAS}</th>
                    <th>{Localization.kr.SIZE_VIRTUAL}</th>
                    <th>포맷</th>
                    <th style={{width:"10px"}}>{Localization.kr.TARGET}</th>
                    <th>{Localization.kr.DISK_PROFILE}</th>
                  </tr>
                </thead>
                <tbody>
                  {diskVoList.map((disk, index) => {
                    const storageDomainId = disk.diskImageVo?.storageDomainVo?.id || "";
                    const diskProfileId = disk.diskImageVo?.diskProfileVo?.id || "";
                    
                    const selectedDomain = domains.find((d) => d.id === storageDomainId);
                    const profileOptions = diskProfilesList[storageDomainId] || [];
                    const selectedProfile = profileOptions.find((p) => p.id === diskProfileId);

                    return (
                      <tr key={disk.id}>
                        <td>
                          <LabelInput label=""
                            value={disk.diskImageVo?.alias || ""}
                            onChange={(e) => handleDiskChange(index, "alias", e.target.value)}
                            className="max-w-[150px]"
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
                            className="template-input max-w-[180px]"
                            value={selectedDomain?.id || ""}
                            loading={isDomainsLoading}
                            options={domains}
                            onChange={(selected) => {
                              handleDiskChange(index, "storageDomainVo", selected, true);
                              const newProfiles = diskProfilesList[selected.id] || [];
                              if (newProfiles.length > 0) {
                                handleDiskChange(index, "diskProfileVo", newProfiles[0], true);
                              }
                            }}
                          />
                          {selectedDomain && (
                            <div className="text-xs text-gray-500 f-end">
                              사용 가능: {checkZeroSizeToGiB(selectedDomain.availableSize)} {" / "} 총 용량: {checkZeroSizeToGiB(selectedDomain.availableSize + selectedDomain.usedSize)}
                            </div>
                          )}
                        </td>
                        <td>
                          <LabelSelectOptionsID
                            className="template-input max-w-[230px]"
                            value={selectedProfile?.id || ""}
                            loading={false}
                            options={profileOptions}
                            onChange={(selected) => handleDiskChange(index, "diskProfileVo", selected, true)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
        </>
      )}
      {!disks || disks.length === 0 ? (
        <div className="font-bold">연결된 {Localization.kr.DISK} 데이터가 없습니다.</div>
      ) : null}

      <ToggleSwitchButton
        label="모든 사용자에게 이 템플릿 접근을 허용"
        checked={formState.allowAllAccess}
        onChange={() => setFormState((prev) => ({ ...prev, allowAllAccess: !formState.allowAllAccess }))}
        tType={"네"} fType={"아니요"}
      />
      {/* <ToggleSwitchButton
        label={`${Localization.kr.VM} 권한 복사`}
        checked={formState.copyVmPermissions}
        onChange={() => setFormState((prev) => ({ ...prev, copyVmPermissions: !formState.copyVmPermissions }))}
        tType={"네"} fType={"아니요"}
      /> */}
    </BaseModal>
  );
};

export default TemplateModal;

const formats = [
  { value: "cow", label: "QCOW2" },
  { value: "raw", label: "Raw" },
];