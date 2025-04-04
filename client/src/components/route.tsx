import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";

export function Route() {
  const noNavbarRoutes = [
    "/user-login",
    "/user-register",
    "/admin/login",
    "/travel-register",
  ];

  const hasRequestedNotificationPermission = useRef(false);

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
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}
