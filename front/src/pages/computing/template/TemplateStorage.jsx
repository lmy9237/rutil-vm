import React, { useEffect, useRef, useState } from "react";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../../components/common/Loading";
import { useAllStoragesFromTemplate } from "../../../api/RQHook";

/**
 * @name TemplateStorage
 * @description 탬플릿에 종속 된 nic 목록
 *
 * @prop {string} templatId 탬플릿 ID
 * @returns {JSX.Element} TemplateStorage
 */
const TemplateStorage = ({ templateId }) => {
  const [isRowExpanded, setRowExpanded] = useState({});
  const [selectedStorageId, setSelectedStorageId] = useState(null); // 선택된 스토리지 ID 상태

  const toggleRow = (id) => {
    setRowExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 테이블외부클릭 색빠지기기
  const tableRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !event.target.closest(".header-right-btns button") &&
        !event.target.closest(".Overlay")
      ) {
        setSelectedStorageId(null); // 올바른 상태 변경
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    data: storages = [], // 기본값 설정
    isLoading,
    isError,
  } = useAllStoragesFromTemplate(templateId, toTableItemPredicateStorages);

  function toTableItemPredicateStorages(storage) {
    return {
      id: storage.id ?? "",
      name: storage.name || "Unnamed Storage",
      status: storage.active ? "활성화" : "비활성화",
      domainType: storage.domainType || "Unknown",
      usedSize: Math.floor(storage.usedSize / 1024 ** 3),
      availableSize: Math.floor(storage.availableSize / 1024 ** 3),
      totalSize: Math.floor(
        (storage.availableSize + storage.usedSize) / 1024 ** 3
      ),
      format: storage.format || "Unknown",
      storageType: storage.storageType || "Unknown",
    };
  }

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading storage data.</div>;

  return (
    <div className="host_empty_outer">
      <div className="header-right-btns">
        <button disabled={!selectedStorageId}>삭제</button>
      </div>
      <span>선택된 ID: {selectedStorageId || "없음"}</span>
      <div ref={tableRef} className="section-table-outer">
        <table>
          <thead>
            <tr>
              <th>스토리지 이름</th>
              <th>도메인 유형</th>
              <th>상태</th>
              <th>가용 공간 (GB)</th>
              <th>사용된 공간 (GB)</th>
              <th>전체 공간 (GB)</th>
            </tr>
          </thead>
          <tbody>
            {storages.map((storage) => (
              <React.Fragment key={storage.id}>
                <tr
                  onClick={() => setSelectedStorageId(storage.id)} // 선택된 스토리지 ID 설정
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedStorageId === storage.id
                        ? "#f0f8ff"
                        : "transparent", // 선택된 행 하이라이트
                  }}
                >
                  <td
                    onClick={() => toggleRow(storage.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      icon={
                        isRowExpanded[storage.id] ? faMinusCircle : faPlusCircle
                      }
                      fixedWidth
                    />
                    {storage.name}
                  </td>
                  <td>{storage.domainType}</td>
                  <td>{storage.status}</td>
                  <td>{storage.availableSize} GiB</td>
                  <td>{storage.usedSize} GiB</td>
                  <td>{storage.totalSize} GiB</td>
                </tr>

                {/* 하위 스토리지 상세 정보 */}
                {isRowExpanded[storage.id] && (
                  <tr className="detail_machine_second">
                    <td colSpan="6" style={{ paddingLeft: "30px" }}>
                      <table>
                        <thead>
                          <tr>
                            <th>포맷</th>
                            <th>스토리지 유형</th>
                            <th>크기</th>
                            <th>상태</th>
                            <th>할당</th>
                            <th>인터페이스</th>
                            <th>유형</th>
                            <th>생성일자</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{storage.format}</td>
                            <td>{storage.storageType}</td>
                            <td>#</td>
                            <td>#</td>
                            <td>#</td>
                            <td>#</td>
                            <td>#</td>
                            <td>#</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateStorage;
