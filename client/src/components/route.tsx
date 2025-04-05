import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";
import AdminNavBar from "./AdminNavBar";

export function Route() {
  const noNavbarRoutes = [
    "/user-login",
    "/user-register",
    "/admin/login",
    "/travel-register",
  ];

  const hasRequestedNotificationPermission = useRef(false);

  const token = getCookie("admin")

  const isAdmin = import.meta.env.VITE_ADMIN_TOKEN

    const navbar =token === isAdmin? <AdminNavBar/>:<Navbar/>
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
