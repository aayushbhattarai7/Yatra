import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../function/GetCookie";

const AdminProtectedRoute = () => {
  const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
  console.log("🚀 ~ AdminProtectedRoute ~ adminToken:", adminToken);
  
  const isAdmin = getCookie("admin");

  if (!isAdmin || isAdmin !== adminToken) {
    return <Navigate to="/user-login" />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
