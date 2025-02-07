import React, { useEffect, useRef, useState } from 'react';
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAllDisksFromTemplate } from '../../../api/RQHook';
import TableRowClick from '../../../components/table/TableRowClick';

const TemplateDisks = ({ templateId }) => {
  const [isRowExpanded, setRowExpanded] = useState({});
  const [selectedDiskId, setSelectedDiskId] = useState(null); // 선택된 디스크 ID 상태

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
        !event.target.closest('.header-right-btns button') &&
        !event.target.closest('.Overlay')
      ) {
        setSelectedDiskId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const { 
    data: disks = [], // 기본값 설정
    isLoading, 
    isError,
  } = useAllDisksFromTemplate(templateId, toTableItemPredicateDisks);

  function toTableItemPredicateDisks(diskAttachment) {
    const disk = diskAttachment?.diskImageVo || {}; // 디스크 이미지 데이터
    return {
      id: diskAttachment?.id ?? '',
      alias: disk.alias || 'Unnamed Disk',
      virtualSize: (disk.virtualSize / (1024 ** 3)).toFixed(0), // 가상 크기를 GiB로 변환
      actualSize: (disk.actualSize / (1024 ** 3)).toFixed(0),   // 실제 크기를 GiB로 변환
      creationTime: disk.createDate || 'N/A',                  // 생성 날짜
      storageDomainName: (
        <TableRowClick type="domains" id={disk.storageDomainVo?.id}>
          {disk?.storageDomainVo?.name}
        </TableRowClick>
      ),
      // storageDomainName: disk.storageDomainVo?.name || 'Unknown',
      diskType: disk.contentType || 'Unknown',
      status: disk.status || 'Unknown',
      // spaceUsed: (82).toFixed(0), // 예시 데이터
      // spaceFree: (17).toFixed(2), // 예시 데이터
      // spaceTotal: (99).toFixed(2), // 예시 데이터
      policy: disk.sparse ? '씬 프로비저닝' : '두꺼운 프로비저닝',
      interfaceType: diskAttachment.interface_ || 'N/A',
    };
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading disks data.</div>;

  return (
    <div className="host_empty_outer">
      <div className="header-right-btns">
        <button disabled={!selectedDiskId}>복제</button>
      </div>
      <span>선택된 ID: {selectedDiskId || '없음'}</span>
      <div ref={tableRef} className="section-table-outer">
        <table>
          <thead>
            <tr>
              <th>별칭</th>
              <th>R/O</th>
              <th>가상 크기</th>
              <th>실제 크기</th>
              <th>상태</th>
              <th>할당 정책</th>
              <th>인터페이스</th>
              <th>유형</th>
              <th>생성 일자</th>
            </tr>
          </thead>
          <tbody>
            {disks.map((disk) => (
              <React.Fragment key={disk.id}>
                <tr
                  onClick={() => setSelectedDiskId(disk.id)} // 디스크 선택 처리
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedDiskId === disk.id ? 'rgb(218, 236, 245)' : 'transparent', // 선택된 행 하이라이트
                  }}
                >
                  <td onClick={() => toggleRow(disk.id)} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={isRowExpanded[disk.id] ? faMinusCircle : faPlusCircle} fixedWidth />
                    {disk.alias}
                  </td>
                  <td>R/W</td> {/* Read/Write 여부는 고정값으로 표시 */}
                  <td>{disk.virtualSize} GiB</td>
                  <td>{disk.actualSize} GiB</td>
                  <td>{disk.status}</td>
                  <td>{disk.policy}</td>
                  <td>{disk.interfaceType}</td>
                  <td>{disk.diskType}</td>
                  <td>{disk.creationTime}</td>
                </tr>

                {/* 하위 디스크 상세 정보 */}
                {isRowExpanded[disk.id] && (
                  <tr className="detail_machine_second">
                    <td colSpan="9" style={{ paddingLeft: '30px' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>도메인 이름</th>
                            <th>도메인 유형</th>
                            <th>상태</th>
                            <th>여유 공간</th>
                            <th>사용된 공간</th>
                            <th>전체 공간</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{disk.storageDomainName}</td>
                            <td>{disk.diskType}</td>
                            <td>활성화</td> {/* 예시 데이터 */}
                            <td>{disk.spaceFree} GiB</td>
                            <td>{disk.spaceUsed} GiB</td>
                            <td>{disk.spaceTotal} GiB</td>
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

export default TemplateDisks;
