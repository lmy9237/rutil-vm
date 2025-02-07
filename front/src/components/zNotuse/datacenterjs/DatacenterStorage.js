import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useDomainsFromDataCenter} from "../../../api/RQHook";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TableOuter from "../../table/TableOuter";
import { useNavigate } from 'react-router-dom';
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";


const DatacenterStorage = ({ dataCenter }) => {
    const navigate = useNavigate();
    const [activePopup, setActivePopup] = useState(null);
    const openPopup = (popupType) => setActivePopup(popupType);
    const closePopup = () => setActivePopup(null);
    const [isPopupBoxVisible, setPopupBoxVisibility] = useState(false);
    const { 
        data: domains, 
        status: domainsStatus, 
        isLoading: isDomainsLoading, 
        isError: isDomainsError 
      } = useDomainsFromDataCenter(dataCenter?.id, toTableItemPredicateDomains);
      function toTableItemPredicateDomains(domain) {
        return {
          icon: '📁', 
          icon2: '💾', // 두 번째 이모티콘을 고정적으로 표시
          name: domain?.name ?? '없음', // 도메인 이름
          domainType: domain?.domainType ?? '없음', // 도메인 유형
          status: domain?.status ? '활성화':'비활성화', // 상태
          availableSize: domain?.availableSize ?? '알 수 없음', // 여유 공간 (GiB)
          usedSize: domain?.usedSize ?? '알 수 없음', // 사용된 공간
          diskSize: domain?.diskSize ?? '알 수 없음', // 전체 공간 (GiB)
          description: domain?.description ?? '설명 없음', // 설명
        };
      }
      const [isPopupOpen, setIsPopupOpen] = useState(false);
  // 버튼 클릭 시 팝업의 열림/닫힘 상태를 토글하는 함수
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handlePopupBoxItemClick = (e) => e.stopPropagation();
    // 팝업 외부 클릭 시 닫히도록 처리
    useEffect(() => {
      const handleClickOutside = (event) => {
        const popupBox = document.querySelector(".content_header_popup"); // 팝업 컨테이너 클래스
        const popupBtn = document.querySelector(".content_header_popup_btn"); // 팝업 버튼 클래스
        if (
          popupBox &&
          !popupBox.contains(event.target) &&
          popupBtn &&
          !popupBtn.contains(event.target)
        ) {
          setIsPopupOpen(false); // 팝업 외부 클릭 시 팝업 닫기
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside); // 이벤트 리스너 추가
      return () => {
        document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 이벤트 리스너 제거
      };
    }, []);
    

    return (
            <>
              <div className="header_right_btns">
                <button>새로 만들기</button>
                <button className='disabled'>분리</button>
                <button className='disabled'>활성</button>
                <button>유지보수</button>
                <button onClick={() => {}}>디스크</button>
                <button className="content_header_popup_btn" onClick={togglePopup}>
                <FontAwesomeIcon icon={faEllipsisV} fixedWidth />
                {isPopupOpen && (
                    <div className="content_header_popup">
                      <div onClick={(e) => { handlePopupBoxItemClick(e); openPopup(); }}>파괴</div>
                      <div onClick={(e) => { handlePopupBoxItemClick(e); openPopup(''); }}>마스터 스토리지 도메인으로 선택</div>
                    </div>
                  )}
                </button>
              </div>
              <TableOuter 
                columns={TableColumnsInfo.STORAGES_FROM_DATACENTER} 
                data={domains}
                onRowClick={() => {}}
                onContextMenuItems={() => [
                  <div key="새로 만들기" onClick={() => console.log()}>새로 만들기</div>,
                  <div key="분리" onClick={() => console.log()}>분리</div>,
                  <div key="활성" onClick={() => console.log()}>활성</div>,
                  <div key="유지보수" onClick={() => console.log()}>유지보수</div>,
                  <div key="디스크" onClick={() => console.log()}>디스크</div>
                ]}
              />
            </>
    );
  };
  
  export default DatacenterStorage;