
const NetworkDetailGeneral = ({ network }) => {
  return (
      <div className="tables">
        <div className="table_container_center">
          <table className="table">
            <tbody>
              <tr><th>이름</th><td>{network?.name}</td></tr>
              <tr><th>ID:</th><td>{network?.id}</td></tr>
              <tr><th>설명:</th><td>{network?.description ?? '없음'}</td></tr>
              <tr><th>VDSM 이름:</th><td>{network?.vdsmName ?? '없음'}</td></tr>
              <tr><th>가상 머신 네트워크:</th><td>{network?.usage?.vm ?? 'false'}</td></tr>
              <tr><th>VLAN 태그:</th><td>{network?.vlan ?? '없음'}</td></tr>
              <tr><th>MTU:</th><td>{network?.mtu ?? '기본값 (1500)'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default NetworkDetailGeneral     