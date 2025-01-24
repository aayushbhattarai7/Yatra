import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
export function Route() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      navigate("/landing");
    } else {
      try {
        const decoded = jwtDecode(token);
        if (!decoded) {
          navigate("/landing");
        }
      } catch (error) {
        navigate("/landing");
      }
    }
  }, [token, navigate]);
  const noNavbarRoutes = ["/user-login", "/user-register"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);
  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
