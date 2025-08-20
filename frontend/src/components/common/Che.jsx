import { Outlet, Navigate } from "react-router-dom";

const checkAuth = () => {
  const isAuthenticated = null;
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoutes;
