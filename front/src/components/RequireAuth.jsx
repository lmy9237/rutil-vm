import useAuth from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({}) => {
  const { auth } = useAuth();
  const location = useLocation();

  const isUserAuthenticated = auth.isUserAuthenticated === true

  return (
    isUserAuthenticated
      ? <Outlet/>
      : <Navigate to="/login" state={{ from: location }} replace />
  )
};

export default RequireAuth;
