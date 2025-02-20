import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useDataCenter, useTemplate } from "../../../api/RQHook";
import { checkKoreanName } from "../../../util";
import "./MDomain.css";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  description: "",
  storageType: false,
  version: "4.7",
  quotaMode: "DISABLED",
};

/**
 * @name DomainGetVmTemplateModal
 * @description 도메인 - 데이터센터 연결 모달
 *
 * @prop {boolean} isOpen
 *
 * @returns {JSX.Element} DomainGetVmTemplateModal
 */
const DomainGetVmTemplateModal = ({ isOpen, type = "vm", dcId, onClose }) => {
  const isVmMode = type === "vm"; // true면 "가상머신", false면 "템플릿"
  const [formState, setFormState] = useState(initialFormState);
  const { data: datacenter } = useDataCenter(dcId);
  const [activeFilter, setActiveFilter] = useState("general");
  const buttonClass = (filter) => `filter_button ${activeFilter === filter ? "active" : ""}`;

  // 임시 데이터 (데이터가 없을 경우 기본값 사용)
  const placeholderData = [
    {
      alias: "Disk-001",
      virtualSize: "100GB",
      profiles: [
        { value: "profile1", label: "Profile A" },
        { value: "profile2", label: "Profile B" },
      ],
    }, {
      alias: "Disk-002",
      virtualSize: "200GB",
      profiles: [
        { value: "profile3", label: "Profile C" },
        { value: "profile4", label: "Profile D" },
      ],
    },
  ];
  const tableRows = [
    { label: "템플릿 ID", value: "TMP-12345" },
    { label: "이름", value: "기본 템플릿" },
    { label: "설명", value: "예시" },
    { label: "호스트 클러스터", value: "Cluster-01" },
    { label: "운영 시스템", value: "Linux" },
    { label: "칩셋/펌웨어 유형", value: "UEFI" },
    { label: "그래픽 프로토콜", value: "SPICE" },
    { label: "비디오 유형", value: "QXL" },
    { label: "최적화 옵션", value: "고성능" },
    { label: "", value: "" },
    { label: "설정된 메모리", value: "4 GB" },
    { label: "CPU 코어 수", value: "4" },
    { label: "모니터 수", value: "1" },
    { label: "고가용성", value: "예" },
    { label: "우선 순위", value: "중간" },
    { label: "USB", value: "사용" },
    { label: "소스", value: "N/A" },
    { label: "상태 비저장", value: "아니오" },
  ];

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (datacenter) {
      setFormState({
        id: datacenter.id,
        name: datacenter.name,
        comment: datacenter.comment,
        description: datacenter.description,
        storageType: String(datacenter.storageType),
        version: datacenter.version,
        quotaMode: datacenter.quotaMode,
      });
    }
  }, [isOpen, datacenter]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!checkKoreanName(formState.name)) return '이름이 유효하지 않습니다.';
    if (!formState.name) return '이름을 입력해주세요.';
    if (!checkKoreanName(formState.description)) return "영어만 입력가능.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    onClose();
    toast.success(`${isVmMode ? "가상머신" : "템플릿"} 가져오기 완료`);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={isVmMode ? "가상머신" : "템플릿"}
      submitTitle={"가져오기"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="get-vm-template modal"> */}
      <div className="get-modal-content mb-1">
        <div className="section-table-outer p-0.5">
          <table>
            <thead>
              <tr>
                {isVmMode ? (
                  <>
                    <th>이름</th>
                    <th>소스</th>
                    <th>메모리</th>
                    <th>CPU</th>
                    <th>아키텍처</th>
                    <th>디스크</th>
                    <th>불량 MAC 재배치</th>
                    <th>부분 허용</th>
                    <th>클러스터</th>
                  </>
                ) : (
                  <>
                    <th>별칭</th>
                    <th>가상 크기</th>
                    <th>메모리</th>
                    <th>CPU</th>
                    <th>아키텍처</th>
                    <th>디스크</th>
                    <th>클러스터</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {placeholderData.map((item, index) => (
                <tr key={index}>
                  {isVmMode ? (
                    // ✅ 가상머신 모드일 때 렌더링
                    <>
                      <td>{item.alias || "N/A"}</td>  {/* 이름 */}
                      <td>{item.source || "oVirt"}</td>  {/* 소스 */}
                      <td>{item.memory || "1024 MB"}</td>  {/* 메모리 */}
                      <td>{item.cpu || "1"}</td>  {/* CPU */}
                      <td>{item.architecture || "x86_64"}</td>  {/* 아키텍처 */}
                      <td>{item.disk || "1"}</td>  {/* 디스크 */}
                      <td>
                        <div className="flex">
                          <input type="checkbox" />  {/* ✅ 불량 MAC 재배치 체크박스 */}
                          <label>재배치</label>
                        </div>
                      </td>
                      <td>
                        <input type="checkbox" /> 
                      </td>  {/* 부분 허용 */}
                      <td>
                        <select>
                          <option value="default">Default</option>
                          <option value="cluster-01">Cluster-01</option>
                          <option value="cluster-02">Cluster-02</option>
                        </select>
                      </td>  {/* 클러스터 */}
                    </>
                  ) : (
                    // ✅ 템플릿 모드일 때 렌더링
                    <>
                      <td>{item.alias || "N/A"}</td>  {/* 별칭 */}
                      <td>{item.virtualSize || "N/A"}</td>  {/* 가상 크기 */}
                      <td>4 GB</td>  {/* 메모리 (임시값) */}
                      <td>4</td>  {/* CPU (임시값) */}
                      <td>x86_64</td>  {/* 아키텍처 */}
                      <td>{item.virtualSize || "N/A"}</td>  {/* 디스크 */}
                      <td>
                        <select>
                          <option value="cluster-01">Cluster-01</option>
                          <option value="cluster-02">Cluster-02</option>
                          <option value="cluster-03">Cluster-03</option>
                        </select>
                      </td>  {/* 클러스터 */}
                    </>
                  )}
                </tr>
              ))}
          </tbody>
          </table>
        </div>
      </div>

      <div className="get-modal-content">
        {/* 필터 버튼 */}
        <div className="host-filter-btns" style={{ marginBottom: "0" }}>
          <button
            className={buttonClass("general")}
            onClick={() => setActiveFilter("general")}
          >
            일반 정보
          </button>
          <button
            className={buttonClass("disk")}
            onClick={() => setActiveFilter("disk")}
          >
            디스크
          </button>
          <button
            className={buttonClass("network")}
            onClick={() => setActiveFilter("network")}
          >
            네트워크 인터페이스
          </button>
        </div>

        {/* 섹션 변경 */}
        {activeFilter === "general" && (
          <div className="get-template-info">
            {Array.from({ length: 3 }, (_, groupIndex) => (
              <div key={groupIndex}>
                {tableRows
                  .filter((_, index) => index % 3 === groupIndex) // 3등분하여 그룹화
                  .map(
                    (row, index) =>
                      row.label && (
                        <div key={index}>
                          <div>{row.label}</div>
                          <div>{row.value}</div>
                        </div>
                      )
                  )}
              </div>
            ))}
          </div>
        )}

        {activeFilter === "disk" && (
          <TablesOuter
            columns={TableColumnsInfo.GET_DISK_TEMPLATES}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
            multiSelect={true}
          />
        )}

        {activeFilter === "network" && (
          <TablesOuter
            columns={TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
            multiSelect={true}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default DomainGetVmTemplateModal;
