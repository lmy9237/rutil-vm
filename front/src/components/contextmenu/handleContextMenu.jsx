import React, { useRef, useState } from "react";
import NetworkTree from "./components/tree/NetworkTree";
import NetworkModals from "./components/modals/NetworkModals";

const NetworkManagerPage = () => {
  const [selectedDiv, setSelectedDiv] = useState(null);

  // 📦 Context menu 관련 상태
  const [contextMenu, setContextMenu] = useState(null); // { item, mouseX, mouseY, type }
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'edit' | ...
  const [selectedNetworks, setSelectedNetworks] = useState([]); // context menu에서 선택된 network
  const menuRef = useRef(null);

  // ✅ 우클릭 시 호출되는 핸들러
  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
      item,
      type,
    });
  };

  // ✅ context menu 내 버튼 클릭 시 모달 오픈
  const openModal = (action) => {
    setActiveModal(action);
    setSelectedNetworks([contextMenu.item]); // 단일 network
    setContextMenu(null); // context 메뉴 닫기
  };

  // ✅ 모달 닫기
  const closeModal = () => {
    setActiveModal(null);
    setSelectedNetworks([]);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* 좌측 트리 영역 */}
      <NetworkTree
        selectedDiv={selectedDiv}
        setSelectedDiv={setSelectedDiv}
        onContextMenu={handleContextMenu}
        contextMenu={contextMenu}
        menuRef={menuRef}
        openModal={openModal} // 전달해줌
      />

      {/* 우측 영역 등 나중에 추가 가능 */}

      {/* 모달 컴포넌트: context 메뉴에서 선택한 항목 기반으로 처리 */}
      <NetworkModals
        activeModal={activeModal}
        network={contextMenu?.item}
        selectedNetworks={selectedNetworks}
        dcId={contextMenu?.item?.dataCenterId}
        onClose={closeModal}
      />
    </div>
  );
};

export default NetworkManagerPage;
