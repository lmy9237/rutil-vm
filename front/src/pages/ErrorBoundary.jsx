import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useRouteError } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import SectionLayout from "../components/SectionLayout";

const ErrorBoundary = () => {
  const location = useLocation();
  const message = location.state?.message || "알 수 없는 오류가 발생했습니다.";

  const error = useRouteError();
  return <ErrorContainer>⚠️ {error instanceof AxiosError ? error?.response?.data : message}</ErrorContainer>;
};

const ErrorContainer = ({children}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SectionLayout>
      <div className="error-text">
        <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth /> &nbsp;
        <span>페이지를 표시할 수 없습니다.</span>
        {children}
        <button onClick={() => navigate("/")}>홈으로 이동</button>
        <button onClick={() => navigate(-2)}>뒤로가기</button>
      </div>
    </SectionLayout>
  );
}

export default ErrorBoundary;
