import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../function/GetCookie";

const ProtectedRoute = () => {
  const isLoggedIn = !!getCookie("accessToken");

  return isLoggedIn ? <Outlet /> : <Navigate to="/user-login" />;
};

export default ProtectedRoute;
