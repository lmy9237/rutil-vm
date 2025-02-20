

const VmNic = ({ nicsState, setNicsState, nics }) => {


  // 변경사항 업데이트
  const handleNicChange = (index, value) => {
    const updatedNics = [...nicsState];
    updatedNics[index] = {
      ...updatedNics[index],
      vnicProfileVo: { id: value },
    };
    setNicsState(updatedNics);
  };

  // vnic 추가
  const handleAddNic = () => {
    if (nicsState.length > 0 && !nicsState[nicsState.length - 1].vnicProfileVo.id) {
      alert("이전 vNIC의 프로파일을 먼저 선택하세요.");
      return;
    }

    const newNicNumber = nicsState.length + 1;
    const updatedNics = [
      ...nicsState,
      { id: "", name: `nic${newNicNumber}`, vnicProfileVo: { id: "" } },
    ];
    setNicsState(updatedNics);
  };
  
  // vnic 삭제
  const handleRemoveNic = (index) => {
    const updatedNics = nicsState.filter((_, i) => i !== index);
  
    // NIC 이름을 nic1, nic2, ... 형태로 재정렬
    const renamedNics = updatedNics.map((nic, i) => ({
      ...nic,
      name: `nic${i + 1}`,
    }));
  
    setNicsState(renamedNics);
  };
  

  return (
    <div className="host-second-content p-1" >
      <p className="mb-0.5">
        vNIC 프로파일을 선택하여 가상 머신 네트워크 인터페이스를 설정하세요.
      </p>

      {nicsState.map((nic, index) => (
        <div key={index} style={{display: "flex",alignItems: "center",marginBottom: "10px",}}>
          <label style={{ marginRight: "10px", width: "100px" }}>
            {nic.name}
          </label>

          <select
            style={{ flex: 1 }}
            value={nic.vnicProfileVo.id}
            onChange={(e) => handleNicChange(index, e.target.value)}
          >
            <option value="">항목을 선택하십시오...</option>
            {nics.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} {`[네트워크: ${profile.networkVo?.name}]`}
              </option>
            ))}
          </select>

          {/* 추가/삭제 */}
          <button
            onClick={handleAddNic}
            disabled={!nic.vnicProfileVo.id}
            style={{ marginLeft: "10px" }}
          >
            +
          </button>
          {nicsState.length > 1 && (
            <button
              onClick={() => handleRemoveNic(index)}
              style={{ marginLeft: "5px" }}
            >
              -
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default VmNic;
