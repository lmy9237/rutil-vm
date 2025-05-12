// 클로드
import { useState } from 'react';

const HostNics4 = ({ hostId }) => {
  // 드래그 가능한 아이템 상태 관리
  const [items, setItems] = useState({
    nic: [
      { id: 'nic-1', content: 'NIC 항목 1' },
      { id: 'nic-2', content: 'NIC 항목 2' },
      { id: 'nic-3', content: 'NIC 항목 3' },
      { id: 'nic-4', content: 'NIC 항목 4' },
    ],
    network: [
      { id: 'network-1', content: '네트워크 항목 1' },
      { id: 'network-2', content: '네트워크 항목 2' },
      { id: 'network-3', content: '네트워크 항목 3' },
    ],
    attchNetwork: [
      { id: 'attchNetwork-1', content: '연결 네트워크 항목 1' },
      { id: 'attchNetwork-2', content: '연결 네트워크 항목 2' },
    ]
  });

  // 현재 드래그 중인 아이템 상태
  const [draggedItems, setDraggedItems] = useState([]);

  // 드래그 시작 핸들러
  const handleDragStart = (e, id, type) => {
    e.dataTransfer.setData('itemId', id);
    e.dataTransfer.setData('itemType', type);
  };

  // 드래그 오버 핸들러 (기본 이벤트 방지)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 드롭 핸들러
  const handleDrop = (e, dropType) => {
    e.preventDefault();
    
    const itemId = e.dataTransfer.getData('itemId');
    const itemType = e.dataTransfer.getData('itemType');
    
    // 같은 타입끼리만 드래그 허용 (network와 attchNetwork는 서로 이동 가능)
    const networkTypes = ['network', 'attchNetwork'];
    const isNetworkDrop = networkTypes.includes(dropType) && networkTypes.includes(itemType);
    const isSameType = itemType === dropType;
    
    if (!isSameType && !isNetworkDrop) {
      return;
    }
    
    // 원본 위치에서 아이템 찾기
    const sourceItems = [...items[itemType]];
    const item = sourceItems.find(item => item.id === itemId);
    const filteredItems = sourceItems.filter(item => item.id !== itemId);
    
    // 같은 영역 내에서의 순서 변경인 경우 (특히 NIC)
    if (isSameType && dropType === 'nic') {
      // 드래그 위치 정보를 이용하여 상대적 위치 계산 (여기서는 간단히 맨 뒤에 추가)
      filteredItems.push({...item});
      
      setItems({
        ...items,
        [itemType]: filteredItems
      });
    } 
    // 다른 영역으로 이동하는 경우
    else {
      // 대상 위치에 아이템 추가
      const targetItems = [...items[dropType]];
      targetItems.push({...item}); // 아이템 복사본 추가
      
      // 상태 업데이트 - 아이템을 원래 위치에서 제거하고 새 위치에 추가
      setItems({
        ...items,
        [itemType]: filteredItems,
        [dropType]: targetItems
      });
    }
    
    // 드래그된 아이템은 별도로 저장하지 않고, 버튼 활성화용으로만 상태 관리
    if (draggedItems.length === 0) {
      setDraggedItems([{ id: 'dummy' }]); // 버튼 활성화를 위한 더미 아이템
    }
  };

  // 드래그된 아이템 초기화 (버튼 클릭 시)
  const handleReset = () => {
    // 모든 아이템을 원래의 초기 상태로 되돌림
    setItems({
      nic: [
        { id: 'nic-1', content: 'NIC 항목 1' },
        { id: 'nic-2', content: 'NIC 항목 2' },
        { id: 'nic-3', content: 'NIC 항목 3' },
        { id: 'nic-4', content: 'NIC 항목 4' },
      ],
      network: [
        { id: 'network-1', content: '네트워크 항목 1' },
        { id: 'network-2', content: '네트워크 항목 2' },
        { id: 'network-3', content: '네트워크 항목 3' },
      ],
      attchNetwork: [
        { id: 'attchNetwork-1', content: '연결 네트워크 항목 1' },
        { id: 'attchNetwork-2', content: '연결 네트워크 항목 2' },
      ]
    });
    
    // 드래그된 아이템 초기화
    setDraggedItems([]);
  };

  return (
    <div className="flex flex-col p-4 gap-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center">드래그 앤 드롭 예시</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NIC 영역의 아이템 간 드래그 위치 감지 */}
        <div 
          className="bg-blue-100 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'nic')}
        >
          <h2 className="text-lg font-semibold mb-3">NIC 항목 (순서 변경 가능)</h2>
          <div className="min-h-64 flex flex-col gap-2">
            {items.nic.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded shadow cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item.id, 'nic')}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-blue-50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-blue-50');
                }}
                onDrop={(e) => {
                  e.stopPropagation(); // 상위 요소의 onDrop이 호출되지 않도록 방지
                  e.currentTarget.classList.remove('bg-blue-50');
                  
                  const draggedItemId = e.dataTransfer.getData('itemId');
                  const draggedItemType = e.dataTransfer.getData('itemType');
                  
                  // NIC 항목 내에서만 순서 변경
                  if (draggedItemType === 'nic') {
                    const newNicItems = [...items.nic];
                    const draggedItem = newNicItems.find(i => i.id === draggedItemId);
                    
                    if (draggedItem) {
                      // 현재 위치에서 항목 제거
                      const filteredItems = newNicItems.filter(i => i.id !== draggedItemId);
                      
                      // 드롭된 위치에 항목 삽입
                      filteredItems.splice(index, 0, draggedItem);
                      
                      setItems({
                        ...items,
                        nic: filteredItems
                      });
                      
                      // 버튼 활성화용 상태 관리
                      if (draggedItems.length === 0) {
                        setDraggedItems([{ id: 'dummy' }]);
                      }
                    }
                  }
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
        
        {/* Network 영역 */}
        <div 
          className="bg-green-100 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'network')}
        >
          <h2 className="text-lg font-semibold mb-3">네트워크 항목 (순서 변경 가능)</h2>
          <div className="min-h-64 flex flex-col gap-2">
            {items.network.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded shadow cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item.id, 'network')}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-green-50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-green-50');
                }}
                onDrop={(e) => {
                  e.stopPropagation(); // 상위 요소의 onDrop이 호출되지 않도록 방지
                  e.currentTarget.classList.remove('bg-green-50');
                  
                  const draggedItemId = e.dataTransfer.getData('itemId');
                  const draggedItemType = e.dataTransfer.getData('itemType');
                  
                  // network와 attchNetwork 간 이동 또는 내부 순서 변경
                  const networkTypes = ['network', 'attchNetwork'];
                  if (networkTypes.includes(draggedItemType)) {
                    if (draggedItemType === 'network') {
                      // 같은 network 내에서 순서 변경
                      const newNetworkItems = [...items.network];
                      const draggedItem = newNetworkItems.find(i => i.id === draggedItemId);
                      
                      if (draggedItem) {
                        // 현재 위치에서 항목 제거
                        const filteredItems = newNetworkItems.filter(i => i.id !== draggedItemId);
                        
                        // 드롭된 위치에 항목 삽입
                        filteredItems.splice(index, 0, draggedItem);
                        
                        setItems({
                          ...items,
                          network: filteredItems
                        });
                        
                        // 버튼 활성화용 상태 관리
                        if (draggedItems.length === 0) {
                          setDraggedItems([{ id: 'dummy' }]);
                        }
                      }
                    } else {
                      // attchNetwork에서 network로 이동
                      const draggedItem = items.attchNetwork.find(i => i.id === draggedItemId);
                      
                      if (draggedItem) {
                        // attchNetwork에서 제거
                        const filteredAttchItems = items.attchNetwork.filter(i => i.id !== draggedItemId);
                        
                        // network의 특정 위치에 삽입
                        const newNetworkItems = [...items.network];
                        newNetworkItems.splice(index, 0, {...draggedItem});
                        
                        setItems({
                          ...items,
                          network: newNetworkItems,
                          attchNetwork: filteredAttchItems
                        });
                        
                        // 버튼 활성화용 상태 관리
                        if (draggedItems.length === 0) {
                          setDraggedItems([{ id: 'dummy' }]);
                        }
                      }
                    }
                  }
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
        
        {/* AttchNetwork 영역 */}
        <div 
          className="bg-purple-100 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'attchNetwork')}
        >
          <h2 className="text-lg font-semibold mb-3">연결 네트워크 항목 (순서 변경 가능)</h2>
          <div className="min-h-64 flex flex-col gap-2">
            {items.attchNetwork.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded shadow cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item.id, 'attchNetwork')}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-purple-50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-purple-50');
                }}
                onDrop={(e) => {
                  e.stopPropagation(); // 상위 요소의 onDrop이 호출되지 않도록 방지
                  e.currentTarget.classList.remove('bg-purple-50');
                  
                  const draggedItemId = e.dataTransfer.getData('itemId');
                  const draggedItemType = e.dataTransfer.getData('itemType');
                  
                  // network와 attchNetwork 간 이동 또는 내부 순서 변경
                  const networkTypes = ['network', 'attchNetwork'];
                  if (networkTypes.includes(draggedItemType)) {
                    if (draggedItemType === 'attchNetwork') {
                      // 같은 attchNetwork 내에서 순서 변경
                      const newAttchNetworkItems = [...items.attchNetwork];
                      const draggedItem = newAttchNetworkItems.find(i => i.id === draggedItemId);
                      
                      if (draggedItem) {
                        // 현재 위치에서 항목 제거
                        const filteredItems = newAttchNetworkItems.filter(i => i.id !== draggedItemId);
                        
                        // 드롭된 위치에 항목 삽입
                        filteredItems.splice(index, 0, draggedItem);
                        
                        setItems({
                          ...items,
                          attchNetwork: filteredItems
                        });
                        
                        // 버튼 활성화용 상태 관리
                        if (draggedItems.length === 0) {
                          setDraggedItems([{ id: 'dummy' }]);
                        }
                      }
                    } else {
                      // network에서 attchNetwork로 이동
                      const draggedItem = items.network.find(i => i.id === draggedItemId);
                      
                      if (draggedItem) {
                        // network에서 제거
                        const filteredNetworkItems = items.network.filter(i => i.id !== draggedItemId);
                        
                        // attchNetwork의 특정 위치에 삽입
                        const newAttchNetworkItems = [...items.attchNetwork];
                        newAttchNetworkItems.splice(index, 0, {...draggedItem});
                        
                        setItems({
                          ...items,
                          network: filteredNetworkItems,
                          attchNetwork: newAttchNetworkItems
                        });
                        
                        // 버튼 활성화용 상태 관리
                        if (draggedItems.length === 0) {
                          setDraggedItems([{ id: 'dummy' }]);
                        }
                      }
                    }
                  }
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 드래그된 항목 표시 대신 상태 설명 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">드래그 상태</h2>
        <div className="p-4 min-h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          {draggedItems.length > 0 ? (
            <p className="text-green-600 font-medium">항목이 이동되었습니다</p>
          ) : (
            <p className="text-gray-500">아직 이동된 항목이 없습니다</p>
          )}
        </div>
      </div>
      
      {/* 활성 버튼 */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleReset}
          disabled={draggedItems.length === 0}
          className={`py-2 px-6 rounded-lg font-medium ${
            draggedItems.length > 0 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {draggedItems.length > 0 ? '활성' : '비활성'}
        </button>
        <p className="ml-4 text-sm text-gray-500">
          * 'network'와 'attchNetwork' 항목은 서로 간에 이동이 가능합니다
        </p>
      </div>
    </div>
  );
}

export default HostNics4;