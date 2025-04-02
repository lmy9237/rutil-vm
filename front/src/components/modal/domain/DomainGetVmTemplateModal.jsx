/* 가상머신/템플릿 가져오기모달 */
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useDataCenter } from "../../../api/RQHook";
import { checkKoreanName } from "../../../util";
import FilterButton from "../../button/FilterButton";
import Localization from "../../../utils/Localization";
import InfoTable from "../../table/InfoTable";
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
    { label: Localization.kr.NAME, value: "기본 템플릿" },
    { label: Localization.kr.DESCRIPTION, value: "예시" },
    { label: `${Localization.kr.HOST} ${Localization.kr.DESCRIPTION}`, value: "Cluster-01" },
    { label: "운영 시스템", value: "Linux" },
    { label: "칩셋/펌웨어 유형", value: "UEFI" },
    { label: "그래픽 프로토콜", value: "SPICE" },
    { label: "비디오 유형", value: "QXL" },
    { label: "최적화 옵션", value: "고성능" },
    { label: "", value: "" },
    { label: `설정된 ${Localization.kr.MEMORY}`, value: "4 GB" },
    { label: "CPU 코어 수", value: "4" },
    { label: "모니터 수", value: "1" },
    { label: Localization.kr.HA, value: "예" },
    { label: "우선 순위", value: "중간" },
    { label: "USB", value: "사용" },
    { label: "소스", value: "N/A" },
    { label: Localization.kr.STATELESS, value: "아니오" },
  ];
  const filterOptions = [
    { key: "general", label: Localization.kr.GENERAL },
    { key: "disk", label: "디스크" },
    { key: "network", label: Localization.kr.NICS },
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


  const validateForm = () => {
    if (!formState.name) 
      return `${Localization.kr.NAME}을 입력해주세요.`;
    if (!checkKoreanName(formState.name)) 
      return `${Localization.kr.NAME}이 유효하지 않습니다.`;
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
      contentStyle={{ width: "880px" }} 
    >
      <div className="mb-1">
        <div className="section-table-outer p-0.5">
          <table>
            <thead>
              <tr>
                {isVmMode ? (
                  <>
                    <th>{Localization.kr.NAME}</th>
                    <th>소스</th>
                    <th>{Localization.kr.MEMORY}</th>
                    <th>CPU</th>
                    <th>아키텍처</th>
                    <th>디스크</th>
                    <th>불량 MAC 재배치</th>
                    <th>부분 허용</th>
                    <th>{Localization.kr.CLUSTER}</th>
                  </>
                ) : (
                  <>
                    <th>{Localization.kr.ALIAS}</th>
                    <th>가상 크기</th>
                    <th>{Localization.kr.MEMORY}</th>
                    <th>CPU</th>
                    <th>아키텍처</th>
                    <th>디스크</th>
                    <th>{Localization.kr.CLUSTER}</th>
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

      <div className="filter-table">
        {/* 필터 버튼 */}
        <FilterButton
          options={filterOptions} activeOption={activeFilter} onClick={setActiveFilter}
        />

        {/* 섹션 변경 */}
        {activeFilter === "general" && (
          <div className="get-template-info three-columns">
            {Array.from({ length: 3 }, (_, groupIndex) => {
              const splitRows = tableRows.filter((_, index) => index % 3 === groupIndex);
              return (
                <div key={groupIndex} className="info-table-wrapper">
                  <InfoTable tableRows={splitRows} />
                </div>
              );
            })}
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
