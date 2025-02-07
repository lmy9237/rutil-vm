// 게스트정보
const GuestInfoSection = () => {
    return (
      <div id="guest_info_outer">
        <div className="tables">
          <div className="table_container_center">
            <table className="table">
              <tbody>
                <tr>
                  <th>유형:</th>
                  <td>Linux</td>
                </tr>
                <tr>
                  <th>아키텍쳐:</th>
                  <td>x86_64</td>
                </tr>
                <tr>
                  <th>운영체제:</th>
                  <td>CentOS Linux 7</td>
                </tr>
                <tr>
                  <th>커널 버전</th>
                  <td>3.10.0-1062.el7_x86_64</td>
                </tr>
                <tr>
                  <th>시간대:</th>
                  <td>KST (UTC + 09:00)</td>
                </tr>
                <tr>
                  <th>로그인된 사용자:</th>
                  <td></td>
                </tr>
                <tr>
                  <th>콘솔 사용자:</th>
                  <td></td>
                </tr>
                <tr>
                  <th>콘솔 클라이언트 IP:</th>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </div>
      </div>
    );
  };

  export default GuestInfoSection;