import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";
import AdminNavBar from "./AdminNavBar";

export function Route() {
  const location = useLocation();
  const noNavbarRoutes = [
    "/user-login",
    "/user-register",
    "/admin/login",
    "/travel-register",
  ];

  const hasRequestedNotificationPermission = useRef(false);
  const token = getCookie("accessToken");

  let navbar = null;

  if (token) {
    try {
      const decodedToken: { role: string } = jwtDecode(token);
      navbar = decodedToken.role === "ADMIN" ? <AdminNavBar /> : <Navbar />;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    if ("Notification" in window && !hasRequestedNotificationPermission.current) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
        hasRequestedNotificationPermission.current = true;
      });
    }
  }, []);

  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && navbar}
      <Outlet />
    </>
  );
}
