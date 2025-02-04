import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../function/GetCookie";

const ProtectedRoute = () => {
  const isLoggedIn = !!getCookie("accessToken");

  return isLoggedIn ? <Outlet /> : <Navigate to="/guide-login" />;
};

export default ProtectedRoute;
