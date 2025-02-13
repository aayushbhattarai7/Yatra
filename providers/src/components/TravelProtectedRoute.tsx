import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../function/GetCookie";
import {jwtDecode} from "jwt-decode";

const TravelProtectedRoute = () => {
  const token = getCookie("accessToken");

  if (!token) return <Navigate to="/travel-login" />;

  try {
    const decoded: { role: string } = jwtDecode(token);
    if (decoded.role === "TRAVEL") return <Outlet />;
  } catch (error) {
    console.error("Invalid token", error);
  }

  return <Navigate to="/travel-login" />;
};

export default TravelProtectedRoute;
