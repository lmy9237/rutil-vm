import React, { useState } from "react";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";
import "./ContextMenu.css";

const ContextMenu = ({ visible, position, menuItems, onClose }) => {
  if (!visible) return null;

  return (
    <div
      className="context-menu"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      onClick={onClose} // 메뉴 클릭 시 닫힘
    >
      {menuItems.map((item, index) => (
        <div key={index} onClick={() => item.onClick()}>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export const useContextMenu = () => {
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // 📌 우클릭 이벤트 핸들러 (타입별로 다른 메뉴 출력)
  const handleContextMenu = (event, type, targetId) => {
    event.preventDefault();
    setContextMenuTarget(targetId);
    setMenuItems(getMenuItems(type, targetId)); // 메뉴 아이템 설정
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuVisible(true);
  };

  // 📌 동적 메뉴 항목 반환
  const getMenuItems = (type, targetId) => {
    switch (type) {
      case "storage":
        return [
          { label: "새로운 도메인", onClick: () => Logger.debug(`도메인 생성 - ${targetId}`) },
          { label: "도메인 가져오기", onClick: () => Logger.debug(`도메인 가져오기 - ${targetId}`) },
          { label: "삭제", onClick: () => Logger.debug(`삭제 - ${targetId}`) },
        ];
      case "network":
        return [
          { label: "새 네트워크", onClick: () => Logger.debug(`새 네트워크 추가 - ${targetId}`) },
          { label: "연결 관리", onClick: () => Logger.debug(`연결 관리 - ${targetId}`) },
        ];
      default:
        return [
          { label: "새로 만들기", onClick: () => Logger.debug(`새로 만들기 - ${targetId}`) },
          { label: Localization.kr.MANAGEMENT, onClick: () => Logger.debug(`관리하기 - ${targetId}`) },
        ];
    }
  };

  // 📌 페이지 클릭 시 ContextMenu 닫기
  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setContextMenuTarget(null);
  };

  return {
    contextMenuVisible,
    contextMenuPosition,
    menuItems,
    handleContextMenu,
    closeContextMenu,
  };
};

export default ContextMenu;
