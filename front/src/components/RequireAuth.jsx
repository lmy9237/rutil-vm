import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth                from "@/hooks/useAuth";

const RequireAuth = () => {
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
