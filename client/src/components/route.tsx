import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
export function Route() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      try {
        const decoded = jwtDecode(token);
        if (!decoded) {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    }
  }, [token, navigate]);
  const noNavbarRoutes = ["/user-login", "/user-register","/adminLogin"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
