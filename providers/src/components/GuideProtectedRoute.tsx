import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";

const GuideProtectedRoute = () => {
  const token = getCookie("accessToken");

  if (!token) return <Navigate to="/guide-login" />;

  try {
    const decoded: { role: string } = jwtDecode(token);
    if (decoded.role === "GUIDE") return <Outlet />;
  } catch (error) {
    console.error("Invalid token", error);
  }

  return <Navigate to="/guide-login" />;
};

export default GuideProtectedRoute;
