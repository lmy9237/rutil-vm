import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';

const Error = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || '알 수 없는 오류가 발생했습니다.';

  return (
    <div id="section">
      <div className='error-text'>
        <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth/> &nbsp;
        <span>페이지를 표시할 수 없습니다.&nbsp;</span>

        <p>{message}</p>
          <button onClick={() => navigate('/')}>홈으로 이동</button>
          <button onClick={() => navigate(-2)}>뒤로가기</button>
      </div>
    </div>
  );
};

export default Error;
