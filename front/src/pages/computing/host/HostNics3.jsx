// 제미나이
import React, { useState, useEffect } from 'react';
import "./nic.css";
// 초기 데이터 정의
const initialData = {
  nic: [
    { id: 'nic1', text: 'NIC 카드 1' },
    { id: 'nic2', text: 'NIC 카드 2' },
    { id: 'nic3', text: 'NIC 카드 3' },
    { id: 'nic4', text: 'NIC 카드 4' },
  ],
  network: [
    { id: 'net1', text: '네트워크 장비 1' },
    { id: 'net2', text: '네트워크 장비 2' },
    { id: 'net3', text: '네트워크 장비 3' },
  ],
  attchNetwork: [
    { id: 'att1', text: '연결된 네트워크 1' },
    { id: 'att2', text: '연결된 네트워크 2' },
  ],
};

const HostNics3 = ({ hostId }) => {
  const [availableItems, setAvailableItems] = useState(initialData);
  const [assignedItems, setAssignedItems] = useState({
    nic: [],
    network: [],
    attchNetwork: [],
  });

  // { item, sourceType, originList: 'available' | 'assigned' }
  const [draggedItemInfo, setDraggedItemInfo] = useState(null);
  const [isAnythingAssigned, setIsAnythingAssigned] = useState(false);
  const [draggingOverTarget, setDraggingOverTarget] = useState(null); // { targetList, type }

  useEffect(() => {
    // assignedItems에 하나라도 항목이 있으면 버튼 활성화
    const hasAssigned = Object.values(assignedItems).some(list => list.length > 0);
    setIsAnythingAssigned(hasAssigned);
  }, [assignedItems]);

  const handleDragStart = (e, item, sourceType, originList) => {
    setDraggedItemInfo({ item, sourceType, originList });
    e.dataTransfer.effectAllowed = 'move';
    // Firefox에서 drag events가 제대로 동작하려면 setData가 필요합니다.
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e, targetListType, targetDestinationList) => {
    e.preventDefault();
    if (draggedItemInfo && draggedItemInfo.sourceType === targetListType) {
      e.dataTransfer.dropEffect = 'move';
      setDraggingOverTarget({ targetList: targetDestinationList, type: targetListType });
    } else {
      e.dataTransfer.dropEffect = 'none';
      setDraggingOverTarget(null);
    }
  };

  const handleDragEnter = (e, targetListType, targetDestinationList) => {
    // handleDragOver에서 처리하므로 중복될 수 있으나, 세밀한 제어를 위해 남겨둘 수 있습니다.
    if (draggedItemInfo && draggedItemInfo.sourceType === targetListType) {
        setDraggingOverTarget({ targetList: targetDestinationList, type: targetListType });
    }
  };

  const handleDragLeave = (e) => {
    // 커서가 drop zone을 떠났을 때 highlighting 제거
    // 자식 요소로 들어갈 때도 발생하므로 주의 필요. e.relatedTarget으로 체크 가능.
    // 간단하게는 onDragOver에서 null로 설정하는 것으로 대체 가능
    const currentTarget = e.currentTarget;
    if (e.relatedTarget && currentTarget.contains(e.relatedTarget)) {
        return; // 자식 요소로 이동한 경우는 무시
    }
    setDraggingOverTarget(null);
  };


  const handleDrop = (e, targetListType, targetDestinationList) => {
    e.preventDefault();
    if (!draggedItemInfo) {
      setDraggingOverTarget(null);
      return;
    }

    const { item, sourceType, originList } = draggedItemInfo;

    // 같은 타입의 목록으로만 이동 가능 (classname 조건)
    if (sourceType === targetListType) {
      // 1. 원본 목록에서 아이템 제거
      if (originList === 'available') {
        setAvailableItems(prev => ({
          ...prev,
          [sourceType]: prev[sourceType].filter(i => i.id !== item.id),
        }));
      } else { // originList === 'assigned'
        setAssignedItems(prev => ({
          ...prev,
          [sourceType]: prev[sourceType].filter(i => i.id !== item.id),
        }));
      }

      // 2. 대상 목록에 아이템 추가
      if (targetDestinationList === 'available') {
        setAvailableItems(prev => ({
          ...prev,
          [targetListType]: [...prev[targetListType], item].sort((a,b) => a.id.localeCompare(b.id)), // 정렬 (선택적)
        }));
      } else { // targetDestinationList === 'assigned'
        setAssignedItems(prev => ({
          ...prev,
          [targetListType]: [...prev[targetListType], item].sort((a,b) => a.id.localeCompare(b.id)), // 정렬 (선택적)
        }));
      }
    }
    setDraggedItemInfo(null);
    setDraggingOverTarget(null);
  };

  const renderList = (items, type, listName, displayName) => {
    const isOver = draggingOverTarget && draggingOverTarget.targetList === listName && draggingOverTarget.type === type;
    const isValidDropTarget = draggedItemInfo && draggedItemInfo.sourceType === type;

    return (
      <div className="list-container">
        <h3>{displayName} ({items.length})</h3>
        <div
          className={`drop-zone ${type} ${isOver && isValidDropTarget ? 'drag-over' : ''}`}
          onDragOver={(e) => handleDragOver(e, type, listName)}
          onDragEnter={(e) => handleDragEnter(e, type, listName)}
          onDragLeave={(e) => handleDragLeave(e)}
          onDrop={(e) => handleDrop(e, type, listName)}
        >
          {items.length === 0 && <p className="empty-message">여기에 항목을 드롭하세요</p>}
          {items.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item, type, listName)}
              className="draggable-item"
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>장비 할당</h1>
      <div className="main-content">
        <div className="column">
          <h2>사용 가능 항목</h2>
          {renderList(availableItems.nic, 'nic', 'available', 'NIC (Available)')}
          {renderList(availableItems.network, 'network', 'available', 'Network (Available)')}
          {renderList(availableItems.attchNetwork, 'attchNetwork', 'available', 'Attached Network (Available)')}
        </div>
        <div className="column">
          <h2>할당된 항목</h2>
          {renderList(assignedItems.nic, 'nic', 'assigned', 'NIC (Assigned)')}
          {renderList(assignedItems.network, 'network', 'assigned', 'Network (Assigned)')}
          {renderList(assignedItems.attchNetwork, 'attchNetwork', 'assigned', 'Attached Network (Assigned)')}
        </div>
      </div>

      {isAnythingAssigned && (
        <div className="button-container">
          <button className="action-button active">활성 버튼</button>
        </div>
      )}
    </div>
  );
}

export default HostNics3;