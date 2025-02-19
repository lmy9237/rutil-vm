import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LoadingOption from "../../common/LoadingOption";
import {
  useAddVnicProfile,
  useAllDataCenters,
  useEditVnicProfile,
  useNetworkFilters,
  useNetworksFromDataCenter,
  useVnicProfile,
} from "../../../api/RQHook";
import "./MVnic.css";

const FormGroup = ({ label, children }) => (
  <div className="vnic-new-box">
    <label>{label}</label>
    {children}
  </div>
);

const VnicProfileModal = ({
  isOpen,
  editMode = false,
  vnicProfileId,
  networkId,
  onClose,
}) => {
  const { mutate: addVnicProfile } = useAddVnicProfile();
  const { mutate: editVnicProfile } = useEditVnicProfile();

  const [formState, setFormState] = useState({
    id: "",
    name: "",
    description: "",
    // passThrough: '',
    portMirroring: false,
    migration: true,
    networkFilter: null,
  });
  const [dataCenterVoId, setDataCenterVoId] = useState("");
  const [networkVoId, setNetworkVoId] = useState(networkId || "");
  // const [networkFilter, setNetworkFilter] = useState('');

  const resetForm = () => {
    setFormState({
      id: "",
      name: "",
      description: "",
      // passThrough: '',
      portMirroring: false,
      migration: true,
      networkFilter: nFilters[0]?.id || "",
    });
    setDataCenterVoId("");
    setNetworkVoId(networkId || "");
  };

  const { data: vnic, isLoading: isVnicLoading } =
    useVnicProfile(vnicProfileId);

  const { data: datacenters = [], isLoading: isDataCentersLoading } =
    useAllDataCenters((e) => ({ ...e }));

  const { data: networks = [], isLoading: isNetworksLoading } =
    useNetworksFromDataCenter(dataCenterVoId || undefined, (e) => ({ ...e }));

  //페일오버
  // const {
  //   data: failoverNics = [],
  //   isLoading: isFailoverNicsLoading
  // } = useAllnicFromVM(dataCenterVoId, (e) => ({
  //   id: e?.id,
  //   name: e?.name,
  // }));
  const { data: nFilters = [], isLoading: isNFiltersLoading } =
    useNetworkFilters((e) => ({ ...e }));
  useEffect(() => {
    if (isNFiltersLoading) {
      console.log("Filters are loading...");
    } else {
      console.log("Filters loaded: ", nFilters);
    }
  }, [nFilters, isNFiltersLoading]);
  // const nFilters = [
  //   { value: "vdsm-no-mac-spoofing", label: "vdsm-no-mac-spoofing" },
  //   { value: "allow-arp", label: "allow-arp" },
  //   { value: "allow-dhcp", label: "allow-dhcp" },
  //   { value: "allow-incoming-ipv4", label: "allow-incoming-ipv4" },
  //   { value: "allow-ipv4", label: "allow-ipv4" },
  //   { value: "clean-traffic", label: "clean-traffic" },
  //   { value: "no-arp-ip-spoofing", label: "no-arp-ip-spoofing" },
  //   { value: "no-arp-spoofing", label: "no-arp-spoofing" },
  //   { value: "no-ip-multicast", label: "no-ip-multicast" },
  //   { value: "no-ip-spoofing", label: "no-ip-spoofing" },
  //   { value: "no-mac-broadcast", label: "no-mac-broadcast" },
  //   { value: "no-mac-spoofing", label: "no-mac-spoofing" },
  //   { value: "no-other-l2-traffic", label: "no-other-l2-traffic" },
  //   { value: "no-other-rarp-traffic", label: "no-other-rarp-traffic" },
  //   { value: "qemu-announce-self", label: "qemu-announce-self" },
  //   { value: "qemu-announce-self-rarp", label: "qemu-announce-self-rarp" },
  //   { value: "clean-traffic-gateway", label: "clean-traffic-gateway" },
  //   { value: "", label: "No Network Filter" },
  // ];

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // 모달이 닫힐 때 상태를 초기화
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      !isVnicLoading &&
      !isDataCentersLoading &&
      !isNetworksLoading
    ) {
      if (editMode && vnic) {
        setFormState({
          id: vnic?.id || "",
          name: vnic?.name || "",
          description: vnic?.description || "",
          migration: vnic?.migration || false,
          passThrough: vnic?.passThrough || "DISABLED",
          portMirroring: vnic?.portMirroring || false,
          networkFilter: vnic?.networkFilterVo
            ? { id: vnic.networkFilterVo.id, name: vnic.networkFilterVo.name }
            : null,
        });
        setDataCenterVoId((prev) => vnic?.dataCenterVo?.id || prev || "");
        setNetworkVoId((prev) => vnic?.networkVo?.id || prev || "");
      } else if (!editMode && datacenters.length > 0) {
        // ✅ 기존 선택값 유지, 없을 경우만 초기화
        setDataCenterVoId((prev) => prev || datacenters[0].id);
  
        // ✅ 네트워크 ID가 있으면 유지, 없으면 첫 번째 네트워크 선택
        setNetworkVoId((prev) => {
          if (networkId) return prev || networkId;
          return prev || (networks.length > 0 ? networks[0].id : "");
        });
      }
    }
  }, [
    isOpen,
    editMode,
    vnic,
    datacenters,
    networks,
    isVnicLoading,
    isDataCentersLoading,
    isNetworksLoading,
  ]);

  useEffect(() => {
    if (!editMode && datacenters.length > 0) {
      setDataCenterVoId(datacenters[0].id);
    }
  }, [datacenters, editMode]);

  useEffect(() => {
    if (!editMode && networks.length > 0) {
      setNetworkVoId(networks[0].id);
    }
  }, [networks, editMode]);
  useEffect(() => {
    if (!editMode && networkId) {
      setNetworkVoId(networkId); // networkId 값을 설정
    } else if (!editMode && networks.length > 0) {
      setNetworkVoId(networks[0].id); // networks의 첫 번째 값을 설정
    }
  }, [editMode, networkId, networks]);
  useEffect(() => {
    if (!editMode && nFilters.length > 0) {
      setFormState((prev) => ({
        ...prev,
        networkFilter: nFilters[0], // 기본값을 첫 번째 네트워크 필터로 설정
      }));
    }
  }, [nFilters, editMode]);

  // 통과에 따라 네트워크필터, 마이그레이션 활성화
  const handlePassthroughChange = (e) => {
    const isChecked = e.target.checked;

    setFormState((prev) => ({
      ...prev,
      passThrough: isChecked ? "ENABLED" : "DISABLED",
      networkFilter: isChecked ? null : prev.networkFilter, // Passthrough 활성화 시 네트워크 필터 제거
      portMirroring: isChecked ? false : prev.portMirroring, // Passthrough 활성화 시 포트 미러링 비활성화
    }));
  };

  const handleFormSubmit = () => {
    // 이름 유효성 검사
    if (!formState.name) {
      return toast.error("이름을 입력해주세요.");
    }

    // 네트워크 유효성 검사
    const selectedNetwork = networks.find((n) => n.id === networkVoId);
    if (!selectedNetwork) {
      return toast.error("유효한 네트워크를 선택해주세요.");
    }

    // 기본 데이터 객체 생성
    const dataToSubmit = {
      id: formState.id,
      name: formState.name,
      description: formState.description,
      passThrough: formState.passThrough,
      migration: formState.migration,
      portMirroring:
        formState.passThrough === "ENABLED" ? false : formState.portMirroring, // ✅ Passthrough 시 포트 미러링 비활성화
      networkVo: { id: selectedNetwork.id, name: selectedNetwork.name },
    };

    // ✅ Passthrough가 `DISABLED`일 때만 네트워크 필터 포함
    if (formState.passThrough !== "ENABLED" && formState.networkFilter) {
      dataToSubmit.networkFilterVo = {
        id: formState.networkFilter.id,
        name: formState.networkFilter.name,
      };
    }

    console.log("dataToSubmit:", dataToSubmit);

    // API 요청
    const mutation = editMode ? editVnicProfile : addVnicProfile;
    mutation(
      editMode
        ? { vnicId: formState.id, vnicData: dataToSubmit }
        : dataToSubmit,
      {
        onSuccess: () => {
          toast.success(
            editMode
              ? "vNIC 프로파일이 성공적으로 편집되었습니다."
              : "vNIC 프로파일이 성공적으로 추가되었습니다."
          );
          onClose();
        },
        onError: (error) => {
          toast.error(
            `vNIC 프로파일 ${editMode ? "편집" : "추가"} 중 오류 발생: ${error}`
          );
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"vNic 프로파일"}
      submitTitle={editMode ? "편집" : "생성"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px", height: "550px" }} 
    >

      {/* <div className="vnic-new-content-popup modal"> */}
      <div className="vnic-new-content">
        <div className="vnic-new-contents" style={{ paddingTop: "0.2rem" }}>
          <FormGroup label="데이터 센터">
            <select
              value={dataCenterVoId}
              onChange={(e) => setDataCenterVoId(e.target.value)}
              disabled={editMode}
            >
              {isDataCentersLoading ? (
                <option>로딩중~</option>
              ) : (
                datacenters &&
                datacenters.map((dc) => (
                  <option key={dc.id} value={dc.id}>
                    {dc.name}: {dc.id}
                  </option>
                ))
              )}
            </select>
          </FormGroup>

          <FormGroup label="네트워크">
            <select
              value={networkVoId}
              onChange={(e) => setNetworkVoId(e.target.value)}
              disabled={editMode}
            >
              {isNetworksLoading ? (
                <option>loading ~~</option>
              ) : (
                networks &&
                networks.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}: {networkVoId}
                  </option>
                ))
              )}
            </select>
          </FormGroup>

          <FormGroup label="별칭">
            <input
              type="text"
              value={formState.name}
              autoFocus
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </FormGroup>

          <FormGroup label="설명">
            <input
              type="text"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup label="네트워크 필터">
            <div style={{ display: "flex", alignItems: "center" }}>
              <select
                id="networkFilter"
                value={formState.networkFilter?.id || ""}
                disabled={formState.passThrough === "ENABLED"} // ✅ Passthrough 체크 시 비활성화
                onChange={(e) => {
                  const selectedFilter = nFilters.find(
                    (filter) => filter.id === e.target.value
                  );
                  setFormState((prev) => ({
                    ...prev,
                    networkFilter: selectedFilter || null,
                  }));
                }}
              >
                <option value="">필터 선택 없음</option>
                {isNFiltersLoading ? (
                  <LoadingOption />
                ) : (
                  nFilters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name}
                    </option>
                  ))
                )}
              </select>
              <span style={{ marginLeft: "1rem" }}>
                {formState.networkFilter
                  ? `ID: ${formState.networkFilter.id}, Name: ${formState.networkFilter.name}`
                  : "필터를 선택해주세요."}
              </span>
            </div>
          </FormGroup>

          <div className="vnic-new-checkbox">
            <input
              type="checkbox"
              id="passThrough"
              checked={formState.passThrough === "ENABLED"}
              onChange={handlePassthroughChange}
            />
            <label htmlFor="passThrough">통과</label>
          </div>

          <div className="vnic-new-checkbox">
            <input
              type="checkbox"
              id="migration"
              checked={formState.migration}
              disabled={formState.passThrough !== "ENABLED"}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  migration: e.target.checked,
                }))
              }
            />
            <label htmlFor="migration">마이그레이션 가능</label>
          </div>

          {/* 페일오버 vNIC 프로파일 */}
          {/* <div className="vnic-new-box">
            <label htmlFor="failover_vnic_profile">페일오버 vNIC 프로파일</label>
            <select
              id="failover_vnic_profile"
              disabled={!formState.migration || !formState.passThrough}
            >
              <option value="none">없음</option>
              {!isFailoverNicsLoading &&
                failoverNics.map((nic) => (
                  <option key={nic.id} value={nic.id}>
                    {nic.name}
                  </option>
                ))}
            </select>
          </div> */}

          <div className="vnic-new-checkbox">
            <input
              type="checkbox"
              id="portMirroring"
              checked={formState.portMirroring}
              disabled={formState.passThrough === "ENABLED"} // ✅ Passthrough 체크 시 비활성화
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  portMirroring: e.target.checked,
                }))
              }
            />
            <label htmlFor="portMirroring">포트 미러링</label>
          </div>

          {/* 모든 사용자 허용 - 편집 모드가 아닌 경우에만 표시 */}
          {/* {!editMode && (
            <div className="vnic-new-checkbox">
              <input 
                type="checkbox" 
                id="allow_all_users" 
                checked
              />
              <label htmlFor="allow_all_users">모든 사용자가 이 프로파일을 사용하도록 허용</label>
            </div>
          )} */}
        </div>
      </div>
    </BaseModal>
  );
};

export default VnicProfileModal;
