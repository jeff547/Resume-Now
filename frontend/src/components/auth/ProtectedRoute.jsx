import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = () => {
  let { token } = useAuth();
  const location = useLocation();
  // logging
  console.log(`Protected Route, Token: ${token}`);

  return token ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
